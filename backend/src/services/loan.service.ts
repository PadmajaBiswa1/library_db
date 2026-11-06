import { db } from '../config/database';
import { ILoan, BookCondition } from '../types';
import { ApiError } from '../utils/apiError';

export class LoanService {
  /**
   * Recalculates all overdue fines based on current date
   */
  public static refreshOverdueStatuses(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const loan of db.loans) {
      if (loan.status === 'ISSUED' || loan.status === 'OVERDUE') {
        const dueDate = new Date(loan.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (today > dueDate) {
          loan.status = 'OVERDUE';
          const diffDays = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          const fine = diffDays * db.policies.finePerDay;
          loan.fineAmount = fine;
          if (loan.fineStatus === 'NONE') {
            loan.fineStatus = 'PENDING';

            // Ensure fine record exists
            const existingRecord = db.fines.find((f) => f.loanId === loan.id);
            if (!existingRecord) {
              db.fines.unshift({
                id: `fine-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                loanId: loan.id,
                memberId: loan.memberId,
                memberName: loan.memberName,
                memberIdentifier: loan.memberIdentifier,
                bookTitle: loan.bookTitle,
                amount: fine,
                daysOverdue: diffDays,
                fineType: 'OVERDUE',
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                notes: `Auto-accrued overdue fine (${diffDays} days @ ₹${db.policies.finePerDay}/day)`,
              });
            } else if (existingRecord.status === 'PENDING') {
              existingRecord.amount = fine;
              existingRecord.daysOverdue = diffDays;
            }
          }
        }
      }
    }
  }

  public static async getAllLoans(filter?: { status?: string; memberIdentifier?: string }): Promise<ILoan[]> {
    this.refreshOverdueStatuses();
    let loans = [...db.loans];

    if (filter?.status && filter.status !== 'ALL') {
      loans = loans.filter((l) => l.status === filter.status);
    }

    if (filter?.memberIdentifier) {
      const id = filter.memberIdentifier.toLowerCase().trim();
      loans = loans.filter((l) => l.memberIdentifier.toLowerCase().includes(id));
    }

    return loans;
  }

  /**
   * 4. Issue Management: Issue books to students/faculty using USN / Faculty ID
   */
  public static async issueBook(data: {
    bookId: string;
    memberIdentifier: string;
    notes?: string;
  }): Promise<ILoan> {
    const book = db.books.find((b) => b.id === data.bookId || b.isbn === data.bookId);
    if (!book) {
      throw ApiError.notFound(`Book '${data.bookId}' not found`);
    }

    if (book.availableCopies <= 0) {
      throw ApiError.badRequest(`No available copies of "${book.title}". Consider placing a reservation.`);
    }

    const member = db.members.find(
      (m) => m.identifier.toLowerCase() === data.memberIdentifier.toLowerCase().trim() || m.id === data.memberIdentifier
    );
    if (!member) {
      throw ApiError.notFound(`Patron with USN / Faculty ID '${data.memberIdentifier}' not found`);
    }

    if (member.status !== 'ACTIVE') {
      throw ApiError.badRequest(`Patron '${member.firstName} ${member.lastName}' account status is ${member.status}`);
    }

    if (member.borrowedBooksCount >= member.maxBooksAllowed) {
      throw ApiError.badRequest(
        `Borrowing limit exceeded: ${member.role} max is ${member.maxBooksAllowed} books (currently holding ${member.borrowedBooksCount})`
      );
    }

    // Check if member already has this exact book issued
    const alreadyHolding = db.loans.find(
      (l) => l.memberId === member.id && l.bookId === book.id && (l.status === 'ISSUED' || l.status === 'OVERDUE')
    );
    if (alreadyHolding) {
      throw ApiError.badRequest(`Patron already holds an issued copy of "${book.title}"`);
    }

    // Calculate due date according to policies (Students vs Faculty)
    const durationDays = member.role === 'FACULTY' ? db.policies.facultyLoanDays : db.policies.studentLoanDays;
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + durationDays);

    const newLoan: ILoan = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      memberIdentifier: member.identifier,
      memberRole: member.role,
      borrowDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'ISSUED',
      renewalCount: 0,
      maxRenewalsAllowed: db.policies.maxRenewalsAllowed,
      returnCondition: null,
      fineAmount: 0,
      fineStatus: 'NONE',
      notes: data.notes || `Issued under ${member.role} standard policy (${durationDays} days)`,
    };

    // Decrement available copies
    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = 'ISSUED';
    }

    // Increment member count
    member.borrowedBooksCount += 1;

    db.loans.unshift(newLoan);
    db.logActivity('ISSUE', 'Book Issued', `"${book.title}" issued to ${member.firstName} ${member.lastName} (${member.identifier}). Due: ${newLoan.dueDate}`);

    return newLoan;
  }

  /**
   * 5. Return Management: Record returned books, condition, and fines
   */
  public static async returnBook(
    loanId: string,
    data?: {
      condition?: BookCondition;
      damageFee?: number;
      notes?: string;
    }
  ): Promise<ILoan> {
    const loan = db.loans.find((l) => l.id === loanId);
    if (!loan) {
      throw ApiError.notFound(`Loan record '${loanId}' not found`);
    }

    if (loan.status === 'RETURNED') {
      throw ApiError.badRequest('This book has already been marked as returned');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    loan.returnDate = todayStr;
    loan.status = 'RETURNED';
    loan.returnCondition = data?.condition || 'GOOD';

    // Calculate final overdue fine if any
    const dueDate = new Date(loan.dueDate);
    const returnDate = new Date(todayStr);
    let overdueFine = 0;
    if (returnDate > dueDate) {
      const diffDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      overdueFine = diffDays * db.policies.finePerDay;
      loan.fineAmount = overdueFine;
      loan.fineStatus = 'PENDING';
    }

    // Damage fee if damaged or lost
    if (data?.condition === 'DAMAGED') {
      const dmg = data.damageFee || db.policies.damagePenaltyRate;
      loan.fineAmount += dmg;
      loan.fineStatus = 'PENDING';

      db.fines.unshift({
        id: `fine-dmg-${Date.now()}`,
        loanId: loan.id,
        memberId: loan.memberId,
        memberName: loan.memberName,
        memberIdentifier: loan.memberIdentifier,
        bookTitle: loan.bookTitle,
        amount: dmg,
        daysOverdue: 0,
        fineType: 'DAMAGE',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        notes: data.notes || 'Damage fine assessed upon return inspection',
      });
    }

    // Update member borrow count
    const member = db.members.find((m) => m.id === loan.memberId);
    if (member && member.borrowedBooksCount > 0) {
      member.borrowedBooksCount -= 1;
    }

    // Update book inventory
    const book = db.books.find((b) => b.id === loan.bookId);
    if (book) {
      if (data?.condition === 'DAMAGED') {
        book.conditionDamaged += 1;
        if (book.conditionGood > 0) book.conditionGood -= 1;
      }

      book.availableCopies += 1;
      book.status = 'AVAILABLE';

      // 7. Check if anyone has reserved this book!
      const pendingReservation = db.reservations
        .filter((r) => r.bookId === book.id && r.status === 'PENDING')
        .sort((a, b) => a.queuePosition - b.queuePosition)[0];

      if (pendingReservation) {
        pendingReservation.status = 'AVAILABLE_FOR_PICKUP';
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3); // 3 days hold
        pendingReservation.expiryDate = expiry.toISOString().split('T')[0];

        db.addNotification(
          'RESERVATION_READY',
          'Reserved Book Available for Pickup',
          `"${book.title}" is now returned and on hold for ${pendingReservation.memberName} (${pendingReservation.memberIdentifier}) until ${pendingReservation.expiryDate}.`,
          pendingReservation.memberId,
          pendingReservation.memberName
        );
      }
    }

    db.logActivity(
      'RETURN',
      'Book Returned',
      `"${loan.bookTitle}" returned by ${loan.memberName}. Condition: ${loan.returnCondition}.`
    );

    return loan;
  }

  /**
   * 6. Book Renewal: Allow extension according to library rules
   */
  public static async renewBook(loanId: string): Promise<ILoan> {
    const loan = db.loans.find((l) => l.id === loanId);
    if (!loan) {
      throw ApiError.notFound(`Loan record '${loanId}' not found`);
    }

    if (loan.status === 'RETURNED') {
      throw ApiError.badRequest('Cannot renew a book that has already been returned');
    }

    if (loan.renewalCount >= loan.maxRenewalsAllowed) {
      throw ApiError.badRequest(`Maximum renewals limit (${loan.maxRenewalsAllowed}) reached for this checkout`);
    }

    // Check if another patron has reserved this book
    const hasReservation = db.reservations.some(
      (r) => r.bookId === loan.bookId && (r.status === 'PENDING' || r.status === 'AVAILABLE_FOR_PICKUP')
    );
    if (hasReservation) {
      throw ApiError.badRequest('Renewal not allowed: Another patron has placed a reservation request for this book');
    }

    // Calculate extended due date
    const extensionDays = loan.memberRole === 'FACULTY' ? db.policies.facultyLoanDays : db.policies.studentLoanDays;
    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + extensionDays);

    loan.dueDate = currentDue.toISOString().split('T')[0];
    loan.renewalCount += 1;
    loan.status = 'RENEWED';
    loan.notes = `Renewed ${loan.renewalCount} time(s). Next due date: ${loan.dueDate}`;

    db.logActivity(
      'RENEW',
      'Book Renewed',
      `"${loan.bookTitle}" renewed by ${loan.memberName}. Extended to ${loan.dueDate}.`
    );

    return loan;
  }
}
