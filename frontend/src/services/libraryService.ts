import { api } from './api';
import {
  IBook,
  IMember,
  ILoan,
  IDashboardStats,
  IReservation,
  IFineRecord,
  IDigitalResource,
  IShelfLocation,
  INotification,
  ILibraryPolicy,
} from '../types';

export const libraryService = {
  // 1. Dashboard Overview
  async getDashboardStats(): Promise<IDashboardStats> {
    return api.get<IDashboardStats>('/stats');
  },

  // 2 & 3. Books & Catalogue
  async getBooks(params?: {
    search?: string;
    category?: string;
    subject?: string;
    availability?: string;
  }): Promise<IBook[]> {
    return api.get<IBook[]>('/books', params);
  },

  async getBookById(id: string): Promise<IBook> {
    return api.get<IBook>(`/books/${id}`);
  },

  async createBook(data: Partial<IBook>): Promise<IBook> {
    return api.post<IBook>('/books', data);
  },

  async updateBook(id: string, data: Partial<IBook>): Promise<IBook> {
    return api.put<IBook>(`/books/${id}`, data);
  },

  async deleteBook(id: string): Promise<void> {
    return api.delete<void>(`/books/${id}`);
  },

  // 4, 5 & 6. Circulation: Issues, Returns, Renewals
  async getLoans(params?: { status?: string; memberIdentifier?: string }): Promise<ILoan[]> {
    return api.get<ILoan[]>('/loans', params);
  },

  async issueBook(payload: {
    bookId: string;
    memberIdentifier: string;
    notes?: string;
  }): Promise<ILoan> {
    return api.post<ILoan>('/loans/issue', payload);
  },

  async returnBook(
    loanId: string,
    payload?: { condition?: string; damageFee?: number; notes?: string }
  ): Promise<ILoan> {
    return api.patch<ILoan>(`/loans/${loanId}/return`, payload);
  },

  async renewBook(loanId: string): Promise<ILoan> {
    return api.patch<ILoan>(`/loans/${loanId}/renew`);
  },

  // 7. Reservations
  async getReservations(status?: string): Promise<IReservation[]> {
    return api.get<IReservation[]>('/reservations', { status });
  },

  async createReservation(payload: {
    bookId: string;
    memberIdentifier: string;
    notes?: string;
  }): Promise<IReservation> {
    return api.post<IReservation>('/reservations', payload);
  },

  async cancelReservation(id: string): Promise<IReservation> {
    return api.patch<IReservation>(`/reservations/${id}/cancel`);
  },

  // 8. Fines
  async getFines(status?: string): Promise<IFineRecord[]> {
    return api.get<IFineRecord[]>('/fines', { status });
  },

  async getFineSummary(): Promise<{
    pendingFinesTotal: number;
    paidFinesTotal: number;
    waivedFinesTotal: number;
    totalFineIncidents: number;
  }> {
    return api.get('/fines/summary');
  },

  async payFine(id: string, paymentMethod = 'CASH'): Promise<IFineRecord> {
    return api.patch<IFineRecord>(`/fines/${id}/pay`, { paymentMethod });
  },

  async waiveFine(id: string, reason: string): Promise<IFineRecord> {
    return api.patch<IFineRecord>(`/fines/${id}/waive`, { reason });
  },

  // 9. Members (Students & Faculty)
  async getMembers(params?: {
    search?: string;
    role?: string;
    department?: string;
  }): Promise<IMember[]> {
    return api.get<IMember[]>('/members', params);
  },

  async getMemberById(id: string): Promise<IMember> {
    return api.get<IMember>(`/members/${id}`);
  },

  async getMemberHistory(id: string): Promise<{
    member: IMember;
    currentlyIssued: ILoan[];
    pastLoans: ILoan[];
    fines: IFineRecord[];
  }> {
    return api.get(`/members/${id}/history`);
  },

  async createMember(data: Partial<IMember>): Promise<IMember> {
    return api.post<IMember>('/members', data);
  },

  // 10. Digital Library
  async getDigitalResources(params?: {
    search?: string;
    category?: string;
    type?: string;
  }): Promise<IDigitalResource[]> {
    return api.get<IDigitalResource[]>('/digital', params);
  },

  async createDigitalResource(data: Partial<IDigitalResource>): Promise<IDigitalResource> {
    return api.post<IDigitalResource>('/digital', data);
  },

  async recordDownload(id: string): Promise<{ downloadCount: number }> {
    return api.post(`/digital/${id}/download`, {});
  },

  async deleteDigitalResource(id: string): Promise<void> {
    return api.delete<void>(`/digital/${id}`);
  },

  // 11. Inventory Management
  async getInventoryAudit(): Promise<{
    summary: {
      totalPhysicalCopies: number;
      availableOnShelf: number;
      activelyIssued: number;
      damagedCopiesCount: number;
      lostCopiesCount: number;
    };
    items: Array<{
      bookId: string;
      title: string;
      isbn: string;
      shelfLocation: string;
      totalCopies: number;
      availableCopies: number;
      conditionGood: number;
      conditionDamaged: number;
      conditionLost: number;
      stockStatus: string;
    }>;
  }> {
    return api.get('/inventory/audit');
  },

  async adjustInventory(payload: {
    bookId: string;
    action: 'ADD_COPIES' | 'MARK_DAMAGED' | 'MARK_LOST';
    quantity: number;
    notes?: string;
  }): Promise<IBook> {
    return api.post<IBook>('/inventory/adjust', payload);
  },

  // 12. Shelves & Racks
  async getShelves(): Promise<IShelfLocation[]> {
    return api.get<IShelfLocation[]>('/shelves');
  },

  async createShelf(data: Partial<IShelfLocation>): Promise<IShelfLocation> {
    return api.post<IShelfLocation>('/shelves', data);
  },

  async getBooksOnShelf(block: string, rack: string): Promise<IBook[]> {
    return api.get<IBook[]>(`/shelves/${block}/${rack}/books`);
  },

  // 13. Notifications & Reminders
  async getNotifications(): Promise<INotification[]> {
    return api.get<INotification[]>('/notifications');
  },

  async markNotificationRead(id: string): Promise<INotification> {
    return api.patch<INotification>(`/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    return api.patch('/notifications/read-all');
  },

  async broadcastAnnouncement(title: string, message: string): Promise<INotification> {
    return api.post<INotification>('/notifications/broadcast', { title, message });
  },

  // 14. Reports & Analytics
  async getAnalyticsReport(): Promise<any> {
    return api.get('/reports');
  },

  // 15. Policies & Settings
  async getPolicies(): Promise<ILibraryPolicy> {
    return api.get<ILibraryPolicy>('/policies');
  },

  async updatePolicies(policies: Partial<ILibraryPolicy>): Promise<ILibraryPolicy> {
    return api.put<ILibraryPolicy>('/policies', policies);
  },
};
