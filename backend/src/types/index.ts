export type BookCategory =
  | 'Computer Science'
  | 'Electronics & Comm'
  | 'Mechanical Eng'
  | 'Mathematics'
  | 'Physics'
  | 'Fiction'
  | 'Non-Fiction'
  | 'Philosophy'
  | 'Management & Business'
  | 'General Knowledge';

export type BookStatus = 'AVAILABLE' | 'ISSUED' | 'RESERVED' | 'MAINTENANCE' | 'LOST';

export interface IBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  category: BookCategory;
  subject: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string; // e.g., "Block-A / Rack-02 / Shelf-3"
  block: string;
  rack: string;
  shelf: string;
  conditionGood: number;
  conditionDamaged: number;
  conditionLost: number;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export type MemberRole = 'STUDENT' | 'FACULTY' | 'STAFF' | 'GENERAL';
export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface IMember {
  id: string;
  identifier: string; // USN for students, Faculty ID for faculty, Membership ID for general
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: MemberRole;
  department: string;
  semester?: number; // for students
  designation?: string; // for faculty
  status: MemberStatus;
  joinedDate: string;
  maxBooksAllowed: number;
  borrowedBooksCount: number;
}

export type LoanStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'RENEWED';
export type BookCondition = 'GOOD' | 'DAMAGED' | 'MARKED' | 'LOST';
export type FineStatus = 'NONE' | 'PENDING' | 'PAID' | 'WAIVED';

export interface ILoan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  memberId: string;
  memberName: string;
  memberIdentifier: string; // USN / Faculty ID
  memberRole: MemberRole;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: LoanStatus;
  renewalCount: number;
  maxRenewalsAllowed: number;
  returnCondition?: BookCondition | null;
  fineAmount: number;
  fineStatus: FineStatus;
  finePaidAt?: string | null;
  waivedReason?: string | null;
  notes?: string;
}

export type ReservationStatus = 'PENDING' | 'AVAILABLE_FOR_PICKUP' | 'FULFILLED' | 'CANCELLED';

export interface IReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  memberId: string;
  memberName: string;
  memberIdentifier: string;
  reservedAt: string;
  status: ReservationStatus;
  queuePosition: number;
  expiryDate?: string;
  notes?: string;
}

export type FineType = 'OVERDUE' | 'DAMAGE' | 'LOST_BOOK';

export interface IFineRecord {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  memberIdentifier: string;
  bookTitle: string;
  amount: number;
  daysOverdue: number;
  fineType: FineType;
  status: 'PENDING' | 'PAID' | 'WAIVED';
  createdAt: string;
  paidAt?: string | null;
  waivedReason?: string | null;
  notes?: string;
}

export type DigitalResourceType =
  | 'E_BOOK'
  | 'RESEARCH_PAPER'
  | 'JOURNAL'
  | 'MAGAZINE'
  | 'COURSE_MATERIAL';

export interface IDigitalResource {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  subject: string;
  resourceType: DigitalResourceType;
  fileFormat: 'PDF' | 'EPUB' | 'LINK';
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  publishedYear: number;
  description: string;
  uploadedAt: string;
}

export interface IShelfLocation {
  id: string;
  block: string;
  floor: string;
  rack: string;
  shelfNumber: string;
  categorySpecialization: string;
  capacity: number;
  currentCount: number;
  description: string;
}

export interface IInventoryAudit {
  id: string;
  bookId: string;
  bookTitle: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  damagedCopies: number;
  lostCopies: number;
  missingCopies: number;
  lastStockCheck: string;
  status: 'NORMAL' | 'DISCREPANCY' | 'ATTENTION_NEEDED';
  notes?: string;
}

export type NotificationType =
  | 'DUE_REMINDER'
  | 'OVERDUE_ALERT'
  | 'RESERVATION_READY'
  | 'ANNOUNCEMENT'
  | 'FINE_NOTICE';

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId?: string; // null means broadcast to all
  recipientName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ILibraryPolicy {
  studentLoanDays: number;
  facultyLoanDays: number;
  studentMaxBooks: number;
  facultyMaxBooks: number;
  maxRenewalsAllowed: number;
  finePerDay: number;
  damagePenaltyRate: number; // fixed or percentage
  lostBookMultiplier: number; // e.g. 2x book price
  libraryTimings: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
  holidays: { date: string; name: string }[];
}

export interface IDailyActivity {
  id: string;
  timestamp: string;
  action: 'ISSUE' | 'RETURN' | 'RENEW' | 'RESERVE' | 'FINE_PAYMENT' | 'NEW_MEMBER' | 'NEW_BOOK';
  title: string;
  details: string;
  actor: string;
}

export interface IDashboardStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  registeredMembers: number;
  totalStudents: number;
  totalFaculty: number;
  pendingFinesTotal: number;
  collectedFinesTotal: number;
  totalDigitalResources: number;
  activeReservationsCount: number;
  categoryDistribution: { category: string; count: number }[];
  dailyActivities: IDailyActivity[];
  recentLoans: ILoan[];
}
