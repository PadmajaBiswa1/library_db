import { db } from '../config/database';
import { IReservation } from '../types';
import { ApiError } from '../utils/apiError';

export class ReservationService {
  public static async getAllReservations(status?: string): Promise<IReservation[]> {
    let list = [...db.reservations];
    if (status && status !== 'ALL') {
      list = list.filter((r) => r.status === status);
    }
    return list;
  }

  public static async createReservation(data: {
    bookId: string;
    memberIdentifier: string;
    notes?: string;
  }): Promise<IReservation> {
    const book = db.books.find((b) => b.id === data.bookId || b.isbn === data.bookId);
    if (!book) {
      throw ApiError.notFound(`Book '${data.bookId}' not found`);
    }

    const member = db.members.find(
      (m) => m.identifier.toLowerCase() === data.memberIdentifier.toLowerCase().trim() || m.id === data.memberIdentifier
    );
    if (!member) {
      throw ApiError.notFound(`Patron with identifier '${data.memberIdentifier}' not found`);
    }

    // Check if member already has active reservation on this book
    const existing = db.reservations.find(
      (r) =>
        r.bookId === book.id &&
        r.memberId === member.id &&
        (r.status === 'PENDING' || r.status === 'AVAILABLE_FOR_PICKUP')
    );
    if (existing) {
      throw ApiError.conflict(`Patron already has an active reservation (#${existing.queuePosition} in queue) on this book`);
    }

    // Determine current queue position
    const currentQueue = db.reservations.filter((r) => r.bookId === book.id && r.status === 'PENDING').length;
    const queuePosition = currentQueue + 1;

    const newRes: IReservation = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      memberIdentifier: member.identifier,
      reservedAt: new Date().toISOString(),
      status: 'PENDING',
      queuePosition,
      notes: data.notes || `Waitlist position ${queuePosition}`,
    };

    db.reservations.unshift(newRes);
    db.logActivity('RESERVE', 'Reservation Queued', `"${book.title}" reserved by ${member.firstName} ${member.lastName} (Queue #${queuePosition})`);

    return newRes;
  }

  public static async cancelReservation(id: string): Promise<IReservation> {
    const res = db.reservations.find((r) => r.id === id);
    if (!res) {
      throw ApiError.notFound(`Reservation '${id}' not found`);
    }

    res.status = 'CANCELLED';
    db.logActivity('RESERVE', 'Reservation Cancelled', `Reservation for "${res.bookTitle}" by ${res.memberName} was cancelled.`);
    return res;
  }

  public static async fulfillReservation(id: string): Promise<IReservation> {
    const res = db.reservations.find((r) => r.id === id);
    if (!res) {
      throw ApiError.notFound(`Reservation '${id}' not found`);
    }

    res.status = 'FULFILLED';
    return res;
  }
}
