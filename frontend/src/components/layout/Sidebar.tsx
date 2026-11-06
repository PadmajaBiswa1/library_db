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
        <div className="fixed inset-0 z-40 bg-[#1A1523]/60 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#38195A] text-[#EDE4F5] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#4E2478] shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#4E2478] flex items-center justify-center text-white shadow-xs">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm tracking-tight text-white leading-tight">
              LibraryHub
            </h1>
            <p className="font-body text-[11px] text-[#EDE4F5]/70">Academic OS</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="px-3 font-body text-[10px] font-semibold text-[#EDE4F5]/60 tracking-wider">
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
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs transition-colors ${
                        isActive
                          ? 'bg-[#4E2478] text-white font-semibold border-l-4 border-[#F30137]'
                          : 'text-[#EDE4F5]/85 hover:bg-[#4E2478]/50 hover:text-white font-medium'
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
        <div className="p-3.5 border-t border-[#4E2478] shrink-0">
          <div className="bg-[#4E2478]/50 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1C8A5C] animate-pulse" />
              <span className="font-body text-[11px] text-[#EDE4F5]">Circulation Engine</span>
            </div>
            <span className="font-body text-[10px] text-[#EDE4F5]/60">Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};
