import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImg from '../../assets/logo.jpeg';
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
        <div className="fixed inset-0 z-40 bg-[#1A1523]/50 backdrop-blur-xs md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E3DEE9] text-[#1A1523] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header with Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[#E3DEE9] shrink-0 bg-white">
          <img
            src={logoImg}
            alt="Library Logo"
            className="w-10 h-10 rounded-lg object-contain border border-[#E3DEE9] bg-white p-0.5 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading font-bold text-sm tracking-tight text-[#1A1523] truncate leading-tight">
              LibraryHub
            </h1>
            <p className="font-body text-[11px] text-[#5C5468] truncate">Central Campus Library</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="px-3 font-body text-[10px] font-semibold text-[#5C5468] tracking-wider uppercase">
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
                      `group flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs transition-all ${
                        isActive
                          ? 'bg-[#EDE4F5] text-[#4E2478] font-semibold border-l-[3px] border-[#F30137] shadow-xs'
                          : 'text-[#5C5468] hover:text-[#1A1523] hover:bg-[#FAF8FC] font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-[#4E2478]' : 'text-[#5C5468] group-hover:text-[#1A1523]'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* System Footer Card */}
        <div className="p-3 border-t border-[#E3DEE9] bg-white shrink-0">
          <div className="bg-[#FAF8FC] border border-[#E3DEE9] rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1C8A5C] animate-pulse" />
              <span className="font-body text-[11px] font-medium text-[#1A1523]">Circulation Engine</span>
            </div>
            <span className="font-body text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-[#5C5468] border border-[#E3DEE9]">
              v2.4
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
