# Library Management Dashboard & OS

A production-ready, clean, scalable Full-Stack Library Management Dashboard built with Express, TypeScript, React 18, Vite, and Tailwind CSS. Designed specifically for academic universities and institutional libraries without unnecessary design bloat or gimmicks.

---

## 15 Comprehensive Feature Modules

1. **Dashboard Overview (`/`)**
   - Real-time operational metrics: Total volumes, available copies, issued checkouts, overdue books, registered members (students & faculty), active reservations, and fine balances.
   - Live chronological feed of daily library activities (checkouts, returns, renewals, reservations, acquisitions).
   - Holdings breakdown by academic subject / category.

2. **Book Management (`/books`)**
   - Add, edit, and delete catalog titles.
   - Complete metadata tracking: Title, author, ISBN, publisher, edition, category, subject, copies, and physical shelf coordinates.

3. **Book Catalogue & Search (`/books`)**
   - Multi-field search across title, author, ISBN, publisher, and subject.
   - Category filtering & instant availability status (Available on Shelf vs All Copies Issued).

4. **Issue Management (`/circulation`)**
   - Issue books to students via USN and faculty via Faculty ID.
   - Automatic due-date calculations based on role policies (e.g. 14 days for students, 30 days for faculty).
   - Validates maximum simultaneous book holding limits before checkout.

5. **Return Management (`/circulation`)**
   - Process book returns with physical inspection conditions: Good, Damaged, Lost.
   - Automatic calculation and logging of overdue fines and damage fees.
   - Restores available shelf copies and triggers hold notifications if a waitlist reservation exists.

6. **Book Renewal (`/circulation`)**
   - Request loan extensions according to policy.
   - Enforces maximum renewal limits and prevents renewal if another patron has placed a hold reservation on the title.

7. **Book Reservations & Waitlist (`/reservations`)**
   - Place reservations on currently borrowed books.
   - Queue management with automatic promotion to READY FOR PICKUP upon return, complete with hold expiry dates.

8. **Fine Management (`/fines`)**
   - Overdue fine tracking calculated dynamically per day overdue.
   - Status tracking across PENDING, PAID, and WAIVED.
   - Counter cash / UPI payment receipts and authorized waiver justification audits.

9. **Student & Faculty Management (`/members`)**
   - Dedicated patron directory for students (USN, department, semester) and faculty (Faculty ID, department, designation).
   - View patron borrowing history and currently held active checkouts.

10. **Digital Library (`/digital`)**
    - Repository for open-access E-Books, research papers, IEEE journals, and course lecture materials.
    - Filter by resource type and subject; direct document download links with live read/download counters.

11. **Inventory Management (`/inventory`)**
    - Stock condition audit (Good, Damaged, Lost/Missing).
    - Health indicators (Healthy, Low Stock, Out of Stock).
    - Adjust stock: Restock new copies, report damages, or write off missing inventory with audit notes.

12. **Shelf & Rack Management (`/shelves`)**
    - Blueprint tracking for library blocks (Block A, B, C, D), floors, rack numbers, and shelf ranges.
    - Rack capacity vs occupancy progress tracking.
    - View all book titles physically shelved in each specific rack.

13. **Notifications & Reminders (`/notifications`)**
    - Overdue alerts, approaching due date notices, and reservation pickup readiness.
    - Broadcast library-wide announcements directly to patron dashboards.

14. **Reports & Analytics (`/reports`)**
    - Key metrics: Return rate percentage, circulation volume, fine recovery ratio.
    - Most borrowed / popular books ranking table.
    - Departmental borrowing breakdown and one-click CSV Report Export.

15. **Library Settings & Policies (`/settings`)**
    - Configure student and faculty loan durations, max book limits, and max renewal counts.
    - Set daily fine rates and damage penalty amounts.
    - Operating hours (weekdays, Saturdays, Sundays) and observed academic holiday calendar.

---

## Design System & Typography

- **Primary (Purple)**: `#4E2478` — nav headers, primary buttons
- **Primary Dark**: `#38195A` — hover/active states, sidebar
- **Primary Light**: `#EDE4F5` — tinted backgrounds, selected rows
- **Accent (Crimson)**: `#F30137` — CTAs, badges, active tab indicator, alerts
- **Accent Dark**: `#C4012C` — hover on accent buttons
- **Accent Light**: `#FDE2E7` — alert/notice backgrounds
- **Ink (body text)**: `#1A1523` — slight purple undertone
- **Ink Muted**: `#5C5468` — supporting text
- **Border**: `#E3DEE9` — dividers, card borders
- **Surface**: `#FFFFFF` — cards
- **Background**: `#FAF8FC` — page background
- **Fonts**: `Poppins` (headings, titles, stat numbers) and `Inter` (body, tables, forms, nav)

---

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```

- Frontend UI: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- Health Check: http://localhost:5000/health
