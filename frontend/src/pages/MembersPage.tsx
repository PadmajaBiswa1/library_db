import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IMember, MemberRole } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Plus,
  Search,
  UserCheck,
  History,
  Filter,
} from 'lucide-react';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [memberHistory, setMemberHistory] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({
    identifier: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STUDENT' as MemberRole,
    department: 'Computer Science & Engineering',
    semester: 4,
    designation: 'Assistant Professor',
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getMembers({
        search: search || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      });
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMembers();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await libraryService.createMember({
        ...form,
        semester: form.role === 'STUDENT' ? Number(form.semester) : undefined,
        designation: form.role === 'FACULTY' ? form.designation : undefined,
      });
      setIsRegisterOpen(false);
      setForm({
        identifier: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        semester: 4,
        designation: 'Assistant Professor',
      });
      loadMembers();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async (memberId: string) => {
    try {
      const history = await libraryService.getMemberHistory(memberId);
      setMemberHistory(history);
      setIsHistoryOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load patron history');
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student & Faculty Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage library membership cards, USN/Faculty IDs, borrowing limits, and circulation history.
          </p>
        </div>
        <Button onClick={() => setIsRegisterOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Register Patron
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md flex gap-2">
          <Input
            placeholder="Search by patron name, USN, Faculty ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-300 text-xs px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="ALL">All Patrons</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Patron Details</th>
                <th className="px-4 py-3">Identifier (USN / ID)</th>
                <th className="px-4 py-3">Role & Department</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Borrowed Books</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No patrons registered.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-[11px]">
                          {m.firstName[0]}
                          {m.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {m.firstName} {m.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">Joined {m.joinedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-slate-800">
                      {m.identifier}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{m.role}</span>
                        {m.semester && (
                          <span className="text-[10px] text-slate-500">Sem {m.semester}</span>
                        )}
                        {m.designation && (
                          <span className="text-[10px] text-slate-500">• {m.designation}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.department}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div>{m.email}</div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">{m.phone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 font-mono text-sm">{m.borrowedBooksCount}</span>
                      <span className="text-slate-400 font-mono text-[11px]"> / {m.maxBooksAllowed} max</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={m.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewHistory(m.id)}
                        icon={<History className="w-3.5 h-3.5 text-slate-500" />}
                      >
                        History
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Drawer Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Patron Borrowing Record">
        {memberHistory && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {memberHistory.member.firstName} {memberHistory.member.lastName}
                </p>
                <p className="text-slate-500 mt-0.5 font-mono">
                  {memberHistory.member.role} • ID: {memberHistory.member.identifier} • {memberHistory.member.department}
                </p>
              </div>
              <Badge variant={memberHistory.member.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {memberHistory.member.status}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 text-xs mb-2">Currently Issued Books ({memberHistory.currentlyIssued.length})</h3>
              {memberHistory.currentlyIssued.length === 0 ? (
                <p className="text-slate-400 text-xs py-2">No active checkouts currently held.</p>
              ) : (
                <div className="space-y-2">
                  {memberHistory.currentlyIssued.map((item: any) => (
                    <div key={item.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{item.bookTitle}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Due: {item.dueDate} • Borrowed: {item.borrowDate}</p>
                      </div>
                      <Badge variant={item.status === 'OVERDUE' ? 'danger' : 'warning'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 text-xs mb-2">Past Returns History ({memberHistory.pastLoans.length})</h3>
              {memberHistory.pastLoans.length === 0 ? (
                <p className="text-slate-400 text-xs py-2">No return records found.</p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {memberHistory.pastLoans.map((item: any) => (
                    <div key={item.id} className="p-2 bg-slate-50 border border-slate-100 rounded text-slate-700 flex justify-between items-center">
                      <span className="font-medium">{item.bookTitle}</span>
                      <span className="text-slate-400 font-mono text-[10px]">Returned {item.returnDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" onClick={() => setIsHistoryOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Student or Faculty Patron">
        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Patron Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={form.role === 'STUDENT'}
                  onChange={() => setForm({ ...form, role: 'STUDENT' })}
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="FACULTY"
                  checked={form.role === 'FACULTY'}
                  onChange={() => setForm({ ...form, role: 'FACULTY' })}
                />
                <span>Faculty</span>
              </label>
            </div>
          </div>

          <Input
            label={form.role === 'STUDENT' ? 'Student USN / Roll Number' : 'Faculty ID / Employee Code'}
            required
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            placeholder={form.role === 'STUDENT' ? 'e.g. 1MS21CS099' : 'e.g. FAC-CSE-105'}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="First name"
            />
            <Input
              label="Last Name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Last name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Campus Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@college.edu"
            />
            <Input
              label="Mobile Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91-9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Information Science">Information Science</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {form.role === 'STUDENT' ? (
              <Input
                label="Current Semester (1 - 8)"
                type="number"
                min="1"
                max="8"
                required
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) || 1 })}
              />
            ) : (
              <Input
                label="Designation"
                required
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Associate Professor"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving} icon={<UserCheck className="w-3.5 h-3.5" />}>
              Create Patron Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
