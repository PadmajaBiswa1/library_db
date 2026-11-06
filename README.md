# Library Management Dashboard & OS 📚

A production-ready, clean, scalable Full-Stack **Library Management Dashboard** built with Express, TypeScript, React 18, Vite, and Tailwind CSS. Designed specifically for academic universities and institutional libraries without unnecessary design bloat or gimmicks.

---

## 🌟 15 Comprehensive Feature Modules

1. **Dashboard Overview (`/`)**
   - Real-time operational metrics: Total volumes, available copies, issued checkouts, overdue books, registered members (students & faculty), active reservations, and fine balances.
   - Live chronological feed of daily library activities (checkouts, returns, renewals, reservations, acquisitions).
   - Holdings breakdown by academic subject / category.

2. **Book Management (`/books`)**
   - Add, edit, and delete catalog titles.
   - Complete metadata tracking: Title, author, ISBN, publisher, edition, category, subject, copies, and physical shelf coordinates.

3. **Book Catalogue & Search (`/books`)**
   - Multi-field search across title, author, ISBN, publisher, and subject.
   - Category filtering & instant availability status (`Available on Shelf` vs `All Copies Issued`).

4. **Issue Management (`/circulation`)**
   - Issue books to students via **USN** and faculty via **Faculty ID**.
   - Automatic due-date calculations based on role policies (e.g. 14 days for students, 30 days for faculty).
   - Validates maximum simultaneous book holding limits before checkout.

5. **Return Management (`/circulation`)**
   - Process book returns with physical inspection conditions: `Good`, `Damaged`, `Lost`.
   - Automatic calculation and logging of overdue fines and damage fees.
   - Restores available shelf copies and triggers hold notifications if a waitlist reservation exists.

6. **Book Renewal (`/circulation`)**
   - Request loan extensions according to policy.
   - Enforces maximum renewal limits and prevents renewal if another patron has placed a hold reservation on the title.

7. **Book Reservations & Waitlist (`/reservations`)**
   - Place reservations on currently borrowed books.
   - Queue management with automatic promotion to `READY FOR PICKUP` upon return, complete with hold expiry dates.

8. **Fine Management (`/fines`)**
   - Overdue fine tracking calculated dynamically per day overdue.
   - Status tracking across `PENDING`, `PAID`, and `WAIVED`.
   - Counter cash / UPI payment receipts and authorized waiver justification audits.

9. **Student & Faculty Management (`/members`)**
   - Dedicated patron directory for students (USN, department, semester) and faculty (Faculty ID, department, designation).
   - View patron borrowing history and currently held active checkouts.

10. **Digital Library (`/digital`)**
    - Repository for open-access E-Books, research papers, IEEE journals, and course lecture materials.
    - Filter by resource type and subject; direct document download links with live read/download counters.

11. **Inventory Management (`/inventory`)**
    - Stock condition audit (Good, Damaged, Lost/Missing).
    - Health indicators (`Healthy`, `Low Stock`, `Out of Stock`).
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
    - Departmental borrowing breakdown and one-click **CSV Report Export**.

15. **Library Settings & Policies (`/settings`)**
    - Configure student and faculty loan durations, max book limits, and max renewal counts.
    - Set daily fine rates and damage penalty amounts.
    - Operating hours (weekdays, Saturdays, Sundays) and observed academic holiday calendar.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/stats` | `GET` | Dashboard overview counts, category chart, daily activity feed |
| `/api/v1/books` | `GET`, `POST` | Get books (with filters) / Add new book |
| `/api/v1/books/:id` | `GET`, `PUT`, `DELETE` | Book details / update / delete |
| `/api/v1/loans` | `GET` | List all circulation loans |
| `/api/v1/loans/issue` | `POST` | Issue book to student USN or faculty ID |
| `/api/v1/loans/:id/return`| `PATCH` | Record return with condition inspection & damage fees |
| `/api/v1/loans/:id/renew` | `PATCH` | Renew book loan extension |
| `/api/v1/reservations` | `GET`, `POST` | List reservations / Place hold reservation |
| `/api/v1/reservations/:id/cancel` | `PATCH` | Cancel reservation |
| `/api/v1/fines` | `GET` | List all fine records |
| `/api/v1/fines/:id/pay` | `PATCH` | Settle fine payment |
| `/api/v1/fines/:id/waive`| `PATCH` | Waive fine with mandatory reason |
| `/api/v1/members` | `GET`, `POST` | List patrons / Register student or faculty |
| `/api/v1/members/:id/history` | `GET` | Patron history & active checkouts |
| `/api/v1/digital` | `GET`, `POST` | List digital resources / Upload new resource |
| `/api/v1/digital/:id/download` | `POST` | Track and increment download |
| `/api/v1/inventory/audit` | `GET` | Stock condition breakdown |
| `/api/v1/inventory/adjust`| `POST` | Restock copies or report damaged/lost |
| `/api/v1/shelves` | `GET`, `POST` | List shelf locations / Add rack |
| `/api/v1/shelves/:block/:rack/books` | `GET` | View books on shelf |
| `/api/v1/notifications` | `GET` | List notifications & alerts |
| `/api/v1/notifications/broadcast` | `POST` | Broadcast campus announcement |
| `/api/v1/reports` | `GET` | Comprehensive circulation & financial analytics |
| `/api/v1/policies` | `GET`, `PUT` | View or update library circulation rules |
