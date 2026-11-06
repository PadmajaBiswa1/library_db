import { db } from '../config/database';
import { ApiError } from '../utils/apiError';

export class InventoryService {
  public static async getInventoryAudit() {
    const totalPhysical = db.books.reduce((acc, b) => acc + b.totalCopies, 0);
    const available = db.books.reduce((acc, b) => acc + b.availableCopies, 0);
    const issued = totalPhysical - available;
    const damaged = db.books.reduce((acc, b) => acc + b.conditionDamaged, 0);
    const lost = db.books.reduce((acc, b) => acc + b.conditionLost, 0);

    const items = db.books.map((b) => ({
      bookId: b.id,
      title: b.title,
      isbn: b.isbn,
      shelfLocation: b.shelfLocation,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies,
      conditionGood: b.conditionGood,
      conditionDamaged: b.conditionDamaged,
      conditionLost: b.conditionLost,
      stockStatus:
        b.availableCopies === 0
          ? 'OUT_OF_STOCK'
          : b.availableCopies <= 2
          ? 'LOW_STOCK'
          : 'HEALTHY',
    }));

    return {
      summary: {
        totalPhysicalCopies: totalPhysical,
        availableOnShelf: available,
        activelyIssued: issued,
        damagedCopiesCount: damaged,
        lostCopiesCount: lost,
      },
      items,
    };
  }

  public static async adjustStock(
    bookId: string,
    action: 'ADD_COPIES' | 'MARK_DAMAGED' | 'MARK_LOST',
    quantity: number,
    notes?: string
  ) {
    const book = db.books.find((b) => b.id === bookId);
    if (!book) {
      throw ApiError.notFound(`Book '${bookId}' not found`);
    }

    if (quantity <= 0) {
      throw ApiError.badRequest('Quantity must be greater than zero');
    }

    if (action === 'ADD_COPIES') {
      book.totalCopies += quantity;
      book.availableCopies += quantity;
      book.conditionGood += quantity;
      db.logActivity('NEW_BOOK', 'Stock Restocked', `Added ${quantity} copies to "${book.title}". New total: ${book.totalCopies}. ${notes || ''}`);
    } else if (action === 'MARK_DAMAGED') {
      if (book.availableCopies < quantity) {
        throw ApiError.badRequest(`Cannot mark ${quantity} copies as damaged; only ${book.availableCopies} copies currently on shelf`);
      }
      book.availableCopies -= quantity;
      book.conditionDamaged += quantity;
      if (book.conditionGood >= quantity) book.conditionGood -= quantity;
      db.logActivity('RETURN', 'Book Damage Recorded', `Marked ${quantity} copy/copies of "${book.title}" as damaged. ${notes || ''}`);
    } else if (action === 'MARK_LOST') {
      if (book.availableCopies < quantity) {
        throw ApiError.badRequest(`Cannot mark ${quantity} copies as lost; only ${book.availableCopies} available on shelf`);
      }
      book.availableCopies -= quantity;
      book.conditionLost += quantity;
      if (book.conditionGood >= quantity) book.conditionGood -= quantity;
      db.logActivity('RETURN', 'Book Loss Recorded', `Marked ${quantity} copy/copies of "${book.title}" as lost. ${notes || ''}`);
    }

    return book;
  }
}
