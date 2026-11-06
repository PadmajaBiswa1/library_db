import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IFineRecord } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Receipt, Check, ShieldAlert } from 'lucide-react';

export const FinesPage: React.FC = () => {
  const [fines, setFines] = useState<IFineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Modals
  const [selectedFine, setSelectedFine] = useState<IFineRecord | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isWaiveOpen, setIsWaiveOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [waiveReason, setWaiveReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadFines = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getFines(filter !== 'ALL' ? filter : undefined);
      setFines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFines();
  }, [filter]);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFine) return;
    try {
      setProcessing(true);
      await libraryService.payFine(selectedFine.id, paymentMethod);
      setIsPayOpen(false);
      setSelectedFine(null);
      loadFines();
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleWaiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFine) return;
    try {
      setProcessing(true);
      await libraryService.waiveFine(selectedFine.id, waiveReason);
      setIsWaiveOpen(false);
      setSelectedFine(null);
      setWaiveReason('');
      loadFines();
    } catch (err: any) {
      alert(err.message || 'Waiver failed');
    } finally {
      setProcessing(false);
    }
  };

  const pendingTotal = fines.filter((f) => f.status === 'PENDING').reduce((acc, f) => acc + f.amount, 0);
  const paidTotal = fines.filter((f) => f.status === 'PAID').reduce((acc, f) => acc + f.amount, 0);
  const waivedTotal = fines.filter((f) => f.status === 'WAIVED').reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fine & Dues Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic overdue fine calculations, damage assessments, payment receipts, and authorized waivers.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide">Pending Dues</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 font-mono">₹{pendingTotal}</p>
          <p className="text-[11px] text-slate-400 mt-1">Outstanding unpaid fines</p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Total Collected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 font-mono">₹{paidTotal}</p>
          <p className="text-[11px] text-slate-400 mt-1">Settled payments with receipts</p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Authorized Waivers</p>
          <p className="mt-1 text-2xl font-bold text-slate-700 font-mono">₹{waivedTotal}</p>
          <p className="text-[11px] text-slate-400 mt-1">Medical & official approvals</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        {['ALL', 'PENDING', 'PAID', 'WAIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === st
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st === 'ALL' ? 'All Fines' : st}
          </button>
        ))}
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Patron & ID</th>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Fine Type</th>
                <th className="px-4 py-3">Days Overdue</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Loading fines...
                  </td>
                </tr>
              ) : fines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No fine records found.
                  </td>
                </tr>
              ) : (
                fines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900 leading-tight">{fine.memberName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">ID: {fine.memberIdentifier}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">{fine.bookTitle}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {fine.fineType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {fine.daysOverdue > 0 ? `${fine.daysOverdue} days` : '—'}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-sm">
                      ₹{fine.amount}.00
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          fine.status === 'PAID'
                            ? 'success'
                            : fine.status === 'PENDING'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {fine.status}
                      </Badge>
                      {fine.waivedReason && (
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                          Reason: {fine.waivedReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {fine.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedFine(fine);
                              setIsPayOpen(true);
                            }}
                            icon={<Receipt className="w-3.5 h-3.5" />}
                          >
                            Collect
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedFine(fine);
                              setIsWaiveOpen(true);
                            }}
                          >
                            Waive
                          </Button>
                        </div>
                      )}
                      {fine.status === 'PAID' && (
                        <span className="text-[11px] text-emerald-600 font-medium">Paid</span>
                      )}
                      {fine.status === 'WAIVED' && (
                        <span className="text-[11px] text-slate-400 font-medium">Waived</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Fine Modal */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Record Fine Payment Receipt">
        <form onSubmit={handlePaySubmit} className="space-y-3.5 text-xs">
          {selectedFine && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-800">{selectedFine.memberName} ({selectedFine.memberIdentifier})</p>
              <p className="text-xs text-slate-500 mt-0.5">Item: {selectedFine.bookTitle}</p>
              <p className="text-base font-bold text-slate-900 font-mono mt-2">
                Amount Due: ₹{selectedFine.amount}.00
              </p>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Payment Settlement Method
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">Counter Cash</option>
              <option value="UPI / QR">Campus UPI / QR Code</option>
              <option value="DEBIT_CARD">Debit / Credit Card</option>
              <option value="STUDENT_ACCOUNT">Adjust against Student Caution Deposit</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPayOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={processing} icon={<Check className="w-3.5 h-3.5" />}>
              Confirm Payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Waive Fine Modal */}
      <Modal isOpen={isWaiveOpen} onClose={() => setIsWaiveOpen(false)} title="Authorize Fine Waiver">
        <form onSubmit={handleWaiveSubmit} className="space-y-3.5 text-xs">
          {selectedFine && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Waiving ₹{selectedFine.amount}.00 for {selectedFine.memberName}</p>
                <p className="text-[11px] text-amber-700">Waivers are audited and require an official justification.</p>
              </div>
            </div>
          )}

          <Input
            label="Official Reason for Waiver"
            required
            value={waiveReason}
            onChange={(e) => setWaiveReason(e.target.value)}
            placeholder="e.g. Approved medical leave certificate / Dean waiver"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsWaiveOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="danger" isLoading={processing}>
              Authorize Waiver
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
