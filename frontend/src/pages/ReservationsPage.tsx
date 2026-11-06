import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IReservation, IBook, IMember } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Plus, XCircle, CheckCircle2, BookmarkCheck } from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    bookId: '',
    memberIdentifier: '',
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [resData, booksData, membersData] = await Promise.all([
        libraryService.getReservations(),
        libraryService.getBooks(),
        libraryService.getMembers(),
      ]);
      setReservations(resData);
      setBooks(booksData);
      setMembers(membersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await libraryService.createReservation(form);
      setIsModalOpen(false);
      setForm({ bookId: '', memberIdentifier: '', notes: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to place reservation');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Cancel this book reservation?')) {
      try {
        await libraryService.cancelReservation(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to cancel reservation');
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Book Reservations & Waitlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage reservation queues for currently borrowed titles and monitor hold notifications.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Place Reservation
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Patron</th>
                <th className="px-4 py-3">Reserved At</th>
                <th className="px-4 py-3">Waitlist Queue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No active reservation requests.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <BookmarkCheck className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{r.bookTitle}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ISBN: {r.bookIsbn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800">{r.memberName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">ID: {r.memberIdentifier}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                      {new Date(r.reservedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        Queue #{r.queuePosition}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          r.status === 'AVAILABLE_FOR_PICKUP'
                            ? 'success'
                            : r.status === 'PENDING'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {r.status === 'AVAILABLE_FOR_PICKUP' ? 'READY FOR PICKUP' : r.status}
                      </Badge>
                      {r.expiryDate && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Hold until: {r.expiryDate}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {r.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(r.id)}
                          icon={<XCircle className="w-3.5 h-3.5 text-slate-500" />}
                        >
                          Cancel
                        </Button>
                      )}
                      {r.status === 'AVAILABLE_FOR_PICKUP' && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Notified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Place Reservation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Place Book Reservation">
        <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Book Title</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              required
            >
              <option value="">-- Choose book to reserve --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (Available: {b.availableCopies}/{b.totalCopies})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Patron USN / Faculty ID
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
              value={form.memberIdentifier}
              onChange={(e) => setForm({ ...form, memberIdentifier: e.target.value })}
              required
            >
              <option value="">-- Choose patron --</option>
              {members.map((m) => (
                <option key={m.id} value={m.identifier}>
                  {m.firstName} {m.lastName} • [{m.identifier}]
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. Needed for final semester capstone project"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Confirm Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
