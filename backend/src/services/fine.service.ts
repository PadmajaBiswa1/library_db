import { db } from '../config/database';
import { IFineRecord } from '../types';
import { ApiError } from '../utils/apiError';
import { LoanService } from './loan.service';

export class FineService {
  public static async getAllFines(status?: string): Promise<IFineRecord[]> {
    LoanService.refreshOverdueStatuses();
    let fines = [...db.fines];
    if (status && status !== 'ALL') {
      fines = fines.filter((f) => f.status === status);
    }
    return fines;
  }

  public static async payFine(fineId: string, paymentMethod = 'CASH'): Promise<IFineRecord> {
    const fine = db.fines.find((f) => f.id === fineId);
    if (!fine) {
      throw ApiError.notFound(`Fine record '${fineId}' not found`);
    }

    if (fine.status === 'PAID') {
      throw ApiError.badRequest('This fine is already paid');
    }

    fine.status = 'PAID';
    fine.paidAt = new Date().toISOString();
    fine.notes = `${fine.notes || ''} [Paid via ${paymentMethod} on ${fine.paidAt.split('T')[0]}]`;

    // Update associated loan fineStatus if present
    const loan = db.loans.find((l) => l.id === fine.loanId);
    if (loan) {
      loan.fineStatus = 'PAID';
      loan.finePaidAt = fine.paidAt;
    }

    db.logActivity('FINE_PAYMENT', 'Fine Settled', `Received ₹${fine.amount}.00 from ${fine.memberName} (${fine.memberIdentifier}) for "${fine.bookTitle}"`);
    return fine;
  }

  public static async waiveFine(fineId: string, reason: string): Promise<IFineRecord> {
    if (!reason || reason.trim().length === 0) {
      throw ApiError.badRequest('A valid reason is required to waive a library fine');
    }

    const fine = db.fines.find((f) => f.id === fineId);
    if (!fine) {
      throw ApiError.notFound(`Fine record '${fineId}' not found`);
    }

    fine.status = 'WAIVED';
    fine.waivedReason = reason;

    const loan = db.loans.find((l) => l.id === fine.loanId);
    if (loan) {
      loan.fineStatus = 'WAIVED';
      loan.waivedReason = reason;
    }

    db.logActivity('FINE_PAYMENT', 'Fine Waived', `Waived ₹${fine.amount}.00 for ${fine.memberName}. Reason: ${reason}`);
    return fine;
  }

  public static async getFineSummary() {
    LoanService.refreshOverdueStatuses();
    const pending = db.fines
      .filter((f) => f.status === 'PENDING')
      .reduce((sum, f) => sum + f.amount, 0);
    const paid = db.fines
      .filter((f) => f.status === 'PAID')
      .reduce((sum, f) => sum + f.amount, 0);
    const waived = db.fines
      .filter((f) => f.status === 'WAIVED')
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      pendingFinesTotal: pending,
      paidFinesTotal: paid,
      waivedFinesTotal: waived,
      totalFineIncidents: db.fines.length,
    };
  }
}
