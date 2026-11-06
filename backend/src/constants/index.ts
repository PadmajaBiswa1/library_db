export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const BOOK_CATEGORIES = [
  'Computer Science',
  'Electronics & Comm',
  'Mechanical Eng',
  'Mathematics',
  'Physics',
  'Fiction',
  'Non-Fiction',
  'Philosophy',
  'Management & Business',
  'General Knowledge',
] as const;

export const DEFAULT_POLICIES = {
  studentLoanDays: 14,
  facultyLoanDays: 30,
  studentMaxBooks: 3,
  facultyMaxBooks: 6,
  maxRenewalsAllowed: 2,
  finePerDay: 2, // 2 units/dollars per day
  damagePenaltyRate: 15,
  lostBookMultiplier: 2,
  libraryTimings: {
    weekdays: '08:00 AM - 08:00 PM',
    saturdays: '09:00 AM - 05:00 PM',
    sundays: '10:00 AM - 02:00 PM (Reading Room Only)',
  },
  holidays: [
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-12-25', name: 'Christmas Day' },
  ],
};
