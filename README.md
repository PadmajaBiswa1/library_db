# Library Management Dashboard

A full-stack, enterprise-grade library management system designed for academic and institutional libraries. It streamlines book cataloging, patron circulation, physical shelf allocation, digital assets, and fine tracking through a clean, responsive interface.

---

## Tech Stack

### Frontend
- **Framework & Runtime**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Typography**: Poppins (Headings & Metrics), Inter (Body & Data Tables)

### Backend
- **Runtime & Framework**: Node.js (v20+), Express.js, TypeScript
- **Execution & Tooling**: TSX (Hot Reloading), Zod (Data Validation)
- **Security & Utilities**: Helmet, CORS, Morgan

---

## Key Features

- **Operational Dashboard**: Real-time counters for inventory, on-shelf copies, active issues, overdue items, fines, and chronological desk activities.
- **Circulation Desk**: Issue books to students (via USN) and faculty (via Faculty ID) with role-based due date automation, return condition inspections, and 1-click renewals.
- **Catalog & Multi-Field Search**: Instant filtering by title, author, ISBN, publisher, subject, category, and real-time shelf availability.
- **Reservations & Waitlists**: Automated queue placement for checked-out books with hold notifications upon return.
- **Fine Management**: Automatic calculation of overdue fines (per-day rate), damage penalty fees, payment receipt recording, and audited waivers.
- **Patron Management**: Unified directory for students (USN, semester, department) and faculty with historical checkout tracking.
- **Digital Library**: Repository for academic papers, open-access e-books, and journals with direct downloads and view counters.
- **Inventory & Shelf Logistics**: Condition tracking (good/damaged/lost), stock adjustments, and physical blueprint management across campus blocks, racks, and shelves.
- **Analytics & Reports**: Departmental checkout distribution, most borrowed titles, and one-click CSV report exports.
- **Configurable Policies**: Customizable loan durations, borrowing quotas, operating hours, and academic holiday schedules.

---

## Project Structure

```text
library-management-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & mock data store
│   │   ├── constants/       # Status codes & default loan policies
│   │   ├── controllers/     # Request handlers across all 15 modules
│   │   ├── middlewares/     # Error handling & validation logic
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic & repository services
│   │   ├── types/           # Domain TypeScript interfaces
│   │   ├── app.ts           # Express application configuration
│   │   └── server.ts        # Server entry point & graceful shutdown
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Logos and static media
│   │   ├── components/      # Reusable UI elements, modals & layouts
│   │   ├── pages/           # Views for circulation, catalog, patrons, etc.
│   │   ├── services/        # Type-safe API client
│   │   ├── types/           # Frontend TypeScript interfaces
│   │   ├── App.tsx          # Client routing
│   │   └── main.tsx         # React mount point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── package.json             # Root workspace runner
└── README.md
```

