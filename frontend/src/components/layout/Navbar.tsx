import React, { useEffect, useState, useRef } from 'react';
import {
  Menu,
  Bell,
  User,
  Clock,
  ChevronDown,
  Settings,
  Users,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { libraryService } from '../../services/libraryService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import logoImg from '../../assets/logo.jpeg';

interface NavbarProps {
  onOpenSidebar: () => void;
}

interface LibrarianPersona {
  id: string;
  name: string;
  designation: string;
  email: string;
  empId: string;
  phone: string;
  department: string;
  qualification: string;
  accessLevel: string;
  shift: string;
  initials: string;
}

const AVAILABLE_ACCOUNTS: LibrarianPersona[] = [
  {
    id: 'lib-1',
    name: 'Dr. Suresh Kumar N.',
    designation: 'Chief Librarian',
    email: 'librarian@msec.ac.in',
    empId: 'MSEC-LIB-001',
    phone: '+91 80 2846 1555 (Ext. 214)',
    department: 'Central Library & Information Centre',
    qualification: 'M.L.I.Sc., Ph.D. in Library & Information Science',
    accessLevel: 'Super Administrator (Full Unrestricted Access)',
    shift: 'General Shift (08:30 AM – 05:00 PM)',
    initials: 'SK',
  },
  {
    id: 'lib-2',
    name: 'Smt. Kavitha R.',
    designation: 'Assistant Librarian',
    email: 'kavitha.lib@msec.ac.in',
    empId: 'MSEC-LIB-004',
    phone: '+91 80 2846 1555 (Ext. 215)',
    department: 'Circulation & Member Services',
    qualification: 'M.L.I.Sc., UGC-NET',
    accessLevel: 'Circulation Officer (Issues, Returns & Fines)',
    shift: 'Morning Shift (08:00 AM – 04:00 PM)',
    initials: 'KR',
  },
  {
    id: 'lib-3',
    name: 'Sri Manjunath G.',
    designation: 'Systems & Digital Librarian',
    email: 'manjunath.systems@msec.ac.in',
    empId: 'MSEC-LIB-008',
    phone: '+91 80 2846 1555 (Ext. 216)',
    department: 'Digital Library & E-Resources',
    qualification: 'M.L.I.Sc., PGDLAN',
    accessLevel: 'Digital Repository & Technical Admin',
    shift: 'General Shift (09:00 AM – 05:30 PM)',
    initials: 'MG',
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<LibrarianPersona>(AVAILABLE_ACCOUNTS[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [switchToast, setSwitchToast] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic academic year computation (e.g. 2026-11 -> "2026–27")
  const getDynamicAcademicYear = (): string => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 is Jan, 5 is June
    // VTU / MSEC academic session begins in June/July (month >= 5)
    const startYear = currentMonth >= 5 ? currentYear : currentYear - 1;
    const endYear = (startYear + 1).toString().slice(-2);
    return `${startYear}–${endYear}`;
  };

  useEffect(() => {
    libraryService
      .getNotifications()
      .then((notifs) => {
        setUnreadCount(notifs.filter((n) => !n.isRead).length);
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleAccountSwitch = (persona: LibrarianPersona) => {
    setActiveUser(persona);
    setIsSwitchModalOpen(false);
    setIsDropdownOpen(false);
    setIsLoggedOut(false);
    setSwitchToast(`Active staff account switched to ${persona.name}`);
    setTimeout(() => setSwitchToast(null), 3500);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsDropdownOpen(false);
    setIsLoggedOut(true);
    setSwitchToast('Librarian session closed. Click re-login to resume.');
  };

  const handleReLogin = (persona: LibrarianPersona = AVAILABLE_ACCOUNTS[0]) => {
    setActiveUser(persona);
    setIsLoggedOut(false);
    setSwitchToast(`Welcome back, ${persona.name}`);
    setTimeout(() => setSwitchToast(null), 3500);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E3DEE9] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg text-[#5C5468] hover:bg-[#FAF8FC] hover:text-[#1A1523] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand logo & title on mobile view */}
          <div className="flex md:hidden items-center gap-2">
            <img
              src={logoImg}
              alt="MSEC Logo"
              className="w-8 h-8 rounded-md object-contain border border-[#E3DEE9] bg-white p-0.5 shadow-xs"
            />
            <div>
              <span className="font-heading font-bold text-xs text-[#1A1523] block leading-tight">
                MSEC Central Library
              </span>
              <span className="font-body text-[10px] text-[#5C5468] block">
                M.S. Engineering College
              </span>
            </div>
          </div>

          {/* Dynamic Academic Year badge on sm+ screens */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-body text-[#5C5468] bg-[#FAF8FC] border border-[#E3DEE9] px-3 py-1.5 rounded-lg shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#4E2478]" />
            <span>
              Academic Year <strong className="font-heading font-semibold text-[#1A1523]">{getDynamicAcademicYear()}</strong> • M.S. Engineering College
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg text-[#5C5468] hover:bg-[#FAF8FC] hover:text-[#4E2478] transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#F30137] text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-[#E3DEE9] mx-1" />

          {/* Logged-in Librarian Profile with Functional Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isLoggedOut ? (
              <button
                onClick={() => handleReLogin()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F30137] bg-[#FDE2E7] text-[#C4012C] font-body text-xs font-semibold hover:bg-[#fad0d9] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In to MSEC Library</span>
              </button>
            ) : (
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 p-1.5 pr-2 rounded-lg border transition-all text-left focus:outline-none ${
                  isDropdownOpen
                    ? 'bg-[#EDE4F5] border-[#4E2478]/40 shadow-xs ring-2 ring-[#4E2478]/15'
                    : 'border-transparent hover:bg-[#FAF8FC] hover:border-[#E3DEE9]'
                }`}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                title="Librarian Account & Settings"
              >
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#4E2478] text-white flex items-center justify-center text-xs font-heading font-semibold shadow-xs">
                    {activeUser.initials}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1C8A5C] border-2 border-white rounded-full"
                    title="Active Session"
                  />
                </div>

                {/* Name, Designation, and Email */}
                <div className="hidden sm:block text-left max-w-[210px]">
                  <p className="font-body text-xs font-semibold text-[#1A1523] leading-tight truncate">
                    {activeUser.name}
                  </p>
                  <p className="font-body text-[11px] text-[#5C5468] leading-tight truncate">
                    <span>{activeUser.designation}</span>
                    <span className="mx-1 text-[#E3DEE9]">•</span>
                    <span className="text-[#4E2478] font-medium">{activeUser.email}</span>
                  </p>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#5C5468] transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-[#4E2478]' : ''
                  }`}
                />
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && !isLoggedOut && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E3DEE9] z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                {/* Dropdown Header Info Card */}
                <div className="px-4 py-3 bg-[#FAF8FC] border-b border-[#E3DEE9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#4E2478] text-white flex items-center justify-center font-heading font-bold text-sm shadow-xs shrink-0">
                      {activeUser.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-semibold text-xs text-[#1A1523] truncate">
                        {activeUser.name}
                      </p>
                      <p className="font-body text-[11px] text-[#4E2478] font-medium truncate">
                        {activeUser.designation}
                      </p>
                      <p className="font-body text-[10px] text-[#5C5468] truncate">
                        {activeUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E3DEE9] flex items-center justify-between text-[10px] text-[#5C5468]">
                    <span className="font-mono">Emp ID: {activeUser.empId}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#EDE4F5] text-[#4E2478] font-semibold text-[9px] uppercase tracking-wider">
                      MSEC Central Library
                    </span>
                  </div>
                </div>

                {/* Dropdown Action Links */}
                <div className="p-1 space-y-0.5 font-body text-xs">
                  {/* My Profile */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1A1523] hover:bg-[#FAF8FC] hover:text-[#4E2478] transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-[#4E2478] shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-xs leading-none">My Profile</p>
                      <p className="text-[10px] text-[#5C5468] mt-0.5">
                        View official credentials, contact & qualifications
                      </p>
                    </div>
                  </button>

                  {/* Account Settings */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1A1523] hover:bg-[#FAF8FC] hover:text-[#4E2478] transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-[#4E2478] shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-xs leading-none">Account Settings</p>
                      <p className="text-[10px] text-[#5C5468] mt-0.5">
                        Circulation rules, fine rates & library policies
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#5C5468]" />
                  </button>

                  {/* Switch Account */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsSwitchModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1A1523] hover:bg-[#FAF8FC] hover:text-[#4E2478] transition-colors text-left"
                  >
                    <Users className="w-4 h-4 text-[#4E2478] shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-xs leading-none">Switch Account</p>
                      <p className="text-[10px] text-[#5C5468] mt-0.5">
                        Toggle between Chief, Assistant or Systems Librarian
                      </p>
                    </div>
                  </button>

                  <div className="my-1 border-t border-[#E3DEE9]" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#D6264C] hover:bg-[#FDE2E7] transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-[#F30137] shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs leading-none">Logout</p>
                      <p className="text-[10px] text-[#C4012C]/80 mt-0.5">
                        End active session for this terminal
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {switchToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1A1523] text-white px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 text-xs font-body animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{switchToast}</span>
        </div>
      )}

      {/* 1. MY PROFILE MODAL */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Librarian Profile • MSEC Central Library"
      >
        <div className="space-y-4 font-body text-xs">
          {/* Institutional Badge Card */}
          <div className="p-4 bg-gradient-to-br from-[#EDE4F5] to-white rounded-xl border border-[#E3DEE9] flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#4E2478] text-white flex items-center justify-center font-heading font-bold text-lg shadow-sm shrink-0">
              {activeUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm text-[#1A1523]">
                  {activeUser.name}
                </h4>
                <span className="px-2 py-0.5 bg-[#4E2478] text-white rounded text-[10px] font-semibold">
                  {activeUser.designation}
                </span>
              </div>
              <p className="text-[#5C5468] text-xs mt-0.5">{activeUser.department}</p>
              <p className="text-[#4E2478] font-medium text-[11px] mt-0.5">
                M.S. Engineering College (MSEC) • VTU Code: 1ME
              </p>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Official Email
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#1A1523] font-medium">
                <Mail className="w-3.5 h-3.5 text-[#4E2478]" />
                <span className="truncate">{activeUser.email}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Institutional Phone
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#1A1523] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#4E2478]" />
                <span className="truncate">{activeUser.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Employee Identification
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#1A1523] font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4E2478]" />
                <span>{activeUser.empId}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Campus Location
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#1A1523] font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#4E2478]" />
                <span className="truncate">Central Library Ground Floor</span>
              </div>
            </div>
          </div>

          {/* Credentials & Access */}
          <div className="space-y-2 pt-2 border-t border-[#E3DEE9]">
            <div>
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Academic Qualifications
              </span>
              <p className="text-xs text-[#1A1523] font-medium mt-0.5">
                {activeUser.qualification}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                System Access Scope
              </span>
              <p className="text-xs text-[#1C8A5C] font-medium mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1C8A5C]" />
                {activeUser.accessLevel}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#5C5468] uppercase tracking-wider block">
                Assigned Operational Shift
              </span>
              <p className="text-xs text-[#1A1523] mt-0.5">{activeUser.shift}</p>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#E3DEE9]">
            <Button size="sm" onClick={() => setIsProfileModalOpen(false)}>
              Close Profile
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2. SWITCH ACCOUNT MODAL */}
      <Modal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        title="Switch Librarian Account"
      >
        <div className="space-y-3 font-body text-xs">
          <p className="text-[#5C5468]">
            Select an authorized MSEC library staff profile to switch your current workstation access:
          </p>

          <div className="space-y-2">
            {AVAILABLE_ACCOUNTS.map((persona) => {
              const isCurrent = persona.id === activeUser.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => handleAccountSwitch(persona)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'border-[#4E2478] bg-[#EDE4F5]/60 ring-1 ring-[#4E2478]'
                      : 'border-[#E3DEE9] bg-white hover:bg-[#FAF8FC] hover:border-[#4E2478]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#4E2478] text-white flex items-center justify-center font-heading font-bold text-xs shadow-xs">
                      {persona.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-xs text-[#1A1523]">
                          {persona.name}
                        </p>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-[#4E2478] text-white rounded text-[9px] font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#4E2478] font-medium">{persona.designation}</p>
                      <p className="text-[10px] text-[#5C5468] font-mono">{persona.email}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCurrent ? 'secondary' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccountSwitch(persona);
                    }}
                  >
                    {isCurrent ? 'Current' : 'Switch'}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-[#E3DEE9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSwitchModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. LOGOUT CONFIRMATION MODAL */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Session Logout"
      >
        <div className="space-y-4 font-body text-xs">
          <p className="text-[#5C5468]">
            Are you sure you want to log out of the <strong>MSEC Central Library</strong> management portal?
          </p>

          <div className="p-3 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
            <p className="font-semibold text-[#1A1523]">{activeUser.name}</p>
            <p className="text-[#5C5468] text-[11px]">{activeUser.designation} • {activeUser.email}</p>
            <p className="text-[10px] text-[#D6264C] mt-1 font-medium">
              Any unsaved changes on circulation forms will be discarded.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Stay Logged In
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmLogout}
              icon={<LogOut className="w-3.5 h-3.5" />}
            >
              Confirm Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
