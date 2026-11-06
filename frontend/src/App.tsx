import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { BooksPage } from './pages/BooksPage';
import { CirculationPage } from './pages/CirculationPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { FinesPage } from './pages/FinesPage';
import { MembersPage } from './pages/MembersPage';
import { DigitalLibraryPage } from './pages/DigitalLibraryPage';
import { InventoryPage } from './pages/InventoryPage';
import { ShelvesPage } from './pages/ShelvesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="circulation" element={<CirculationPage />} />
          <Route path="loans" element={<Navigate to="/circulation" replace />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="fines" element={<FinesPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="digital" element={<DigitalLibraryPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="shelves" element={<ShelvesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
