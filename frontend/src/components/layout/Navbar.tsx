import React, { useEffect, useState } from 'react';
import { Menu, Bell, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { libraryService } from '../../services/libraryService';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    libraryService
      .getNotifications()
      .then((notifs) => {
        setUnreadCount(notifs.filter((n) => !n.isRead).length);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Academic Year 2025–26 • Central Campus Library</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Chief Librarian</p>
            <p className="text-[11px] text-slate-400">lib.admin@institution.edu</p>
          </div>
        </div>
      </div>
    </header>
  );
};
