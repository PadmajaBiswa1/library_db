import { db } from '../config/database';
import { IDashboardStats } from '../types';
import { LoanService } from './loan.service';

export class StatsService {
  public static async getDashboardMetrics(): Promise<IDashboardStats> {
    LoanService.refreshOverdueStatuses();

    const totalBooks = db.books.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableBooks = db.books.reduce((acc, b) => acc + b.availableCopies, 0);
    const issuedBooks = db.loans.filter((l) => l.status === 'ISSUED').length;
    const overdueBooks = db.loans.filter((l) => l.status === 'OVERDUE').length;
    const registeredMembers = db.members.length;
    const totalStudents = db.members.filter((m) => m.role === 'STUDENT').length;
    const totalFaculty = db.members.filter((m) => m.role === 'FACULTY').length;

    const pendingFinesTotal = db.fines
      .filter((f) => f.status === 'PENDING')
      .reduce((sum, f) => sum + f.amount, 0);

    const collectedFinesTotal = db.fines
      .filter((f) => f.status === 'PAID')
      .reduce((sum, f) => sum + f.amount, 0);

    const totalDigitalResources = db.digitalResources.length;
    const activeReservationsCount = db.reservations.filter((r) => r.status === 'PENDING' || r.status === 'AVAILABLE_FOR_PICKUP').length;

    const categoryMap: Record<string, number> = {};
    for (const b of db.books) {
      categoryMap[b.category] = (categoryMap[b.category] || 0) + b.totalCopies;
    }

    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    const dailyActivities = db.dailyActivities.slice(0, 10);
    const recentLoans = db.loans.slice(0, 6);

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      registeredMembers,
      totalStudents,
      totalFaculty,
      pendingFinesTotal,
      collectedFinesTotal,
      totalDigitalResources,
      activeReservationsCount,
      categoryDistribution,
      dailyActivities,
      recentLoans,
    };
  }
}
