import { db } from '../config/database';
import { LoanService } from './loan.service';

export class ReportService {
  public static async generateComprehensiveReport() {
    LoanService.refreshOverdueStatuses();

    // 1. Circulation stats
    const totalIssuedEver = db.loans.length;
    const activeIssued = db.loans.filter((l) => l.status === 'ISSUED').length;
    const overdueCount = db.loans.filter((l) => l.status === 'OVERDUE').length;
    const returnedCount = db.loans.filter((l) => l.status === 'RETURNED').length;

    // 2. Fines stats
    const totalFineAmount = db.fines.reduce((sum, f) => sum + f.amount, 0);
    const paidFines = db.fines.filter((f) => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
    const pendingFines = db.fines.filter((f) => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);
    const waivedFines = db.fines.filter((f) => f.status === 'WAIVED').reduce((sum, f) => sum + f.amount, 0);

    // 3. Most Popular / Borrowed Books
    const bookBorrowFrequency: Record<string, { title: string; isbn: string; count: number; category: string }> = {};
    for (const loan of db.loans) {
      if (!bookBorrowFrequency[loan.bookId]) {
        const book = db.books.find((b) => b.id === loan.bookId);
        bookBorrowFrequency[loan.bookId] = {
          title: loan.bookTitle,
          isbn: loan.bookIsbn,
          count: 0,
          category: book?.category || 'General',
        };
      }
      bookBorrowFrequency[loan.bookId].count += 1;
    }

    const popularBooks = Object.values(bookBorrowFrequency).sort((a, b) => b.count - a.count);

    // 4. Department-wise circulation
    const deptDistribution: Record<string, number> = {};
    for (const member of db.members) {
      deptDistribution[member.department] = (deptDistribution[member.department] || 0) + member.borrowedBooksCount;
    }

    const departmentCirculation = Object.entries(deptDistribution).map(([dept, count]) => ({
      department: dept,
      activeCheckouts: count,
    }));

    // 5. Inventory summary
    const totalPhysical = db.books.reduce((acc, b) => acc + b.totalCopies, 0);
    const available = db.books.reduce((acc, b) => acc + b.availableCopies, 0);

    return {
      generatedAt: new Date().toISOString(),
      circulation: {
        totalTransactionsEver: totalIssuedEver,
        activeCheckouts: activeIssued,
        overdueItems: overdueCount,
        successfullyReturned: returnedCount,
        returnRatePercentage: totalIssuedEver > 0 ? Math.round((returnedCount / totalIssuedEver) * 100) : 0,
      },
      financials: {
        totalFinesAccrued: totalFineAmount,
        totalCollected: paidFines,
        totalPending: pendingFines,
        totalWaived: waivedFines,
      },
      popularBooks,
      departmentCirculation,
      inventorySummary: {
        totalPhysicalCopies: totalPhysical,
        availableOnShelf: available,
        totalCatalogTitles: db.books.length,
      },
    };
  }
}
