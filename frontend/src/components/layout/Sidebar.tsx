import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Repeat,
  BookmarkCheck,
  Receipt,
  Users,
  Binary,
  Boxes,
  MapPin,
  Bell,
  BarChart3,
  Sliders,
  Library,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'MAIN',
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      title: 'CIRCULATION',
      items: [
        { name: 'Issue & Returns', href: '/circulation', icon: Repeat },
        { name: 'Reservations', href: '/reservations', icon: BookmarkCheck },
        { name: 'Fines & Dues', href: '/fines', icon: Receipt },
      ],
    },
    {
      title: 'CATALOG & ASSETS',
      items: [
        { name: 'Book Catalog', href: '/books', icon: BookOpen },
        { name: 'Digital Library', href: '/digital', icon: Binary },
      ],
    },
    {
      title: 'COMMUNITY',
      items: [{ name: 'Students & Faculty', href: '/members', icon: Users }],
    },
    {
      title: 'LOGISTICS',
      items: [
        { name: 'Inventory & Stock', href: '/inventory', icon: Boxes },
        { name: 'Shelves & Racks', href: '/shelves', icon: MapPin },
      ],
    },
    {
      title: 'SYSTEM & INSIGHTS',
      items: [
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
        { name: 'Policies & Settings', href: '/settings', icon: Sliders },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
              LibraryHub OS
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Academic</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold text-slate-400 tracking-wider">
                {sec.title}
              </p>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* System Footer Status */}
        <div className="p-3.5 border-t border-slate-800 shrink-0">
          <div className="bg-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Circulation Engine</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.1</span>
          </div>
        </div>
      </aside>
    </>
  );
};
