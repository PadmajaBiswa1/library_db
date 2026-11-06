import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { ILoan, IBook, IMember } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const CirculationPage: React.FC = () => {
  const [loans, setLoans] = useState<ILoan[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchPatron, setSearchPatron] = useState('');

  // Modals
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ILoan | null>(null);
  const [processing, setProcessing] = useState(false);

  // Issue Form
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberIdentifier: '',
    notes: '',
  });

  // Return Form
  const [returnForm, setReturnForm] = useState({
    condition: 'GOOD' as 'GOOD' | 'DAMAGED' | 'LOST',
    damageFee: 0,
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, booksData, membersData] = await Promise.all([
        libraryService.getLoans({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          memberIdentifier: searchPatron || undefined,
        }),
        libraryService.getBooks({ availability: 'AVAILABLE' }),
        libraryService.getMembers(),
      ]);
      setLoans(loansData);
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
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.memberIdentifier) {
      alert('Please select a book and specify the student USN or faculty ID.');
      return;
    }
    try {
      setProcessing(true);
      await libraryService.issueBook(issueForm);
      setIsIssueOpen(false);
      setIssueForm({ bookId: '', memberIdentifier: '', notes: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to issue book');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenReturn = (loan: ILoan) => {
    setSelectedLoan(loan);
    setReturnForm({
      condition: 'GOOD',
      damageFee: 0,
      notes: '',
    });
    setIsReturnOpen(true);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    try {
      setProcessing(true);
      await libraryService.returnBook(selectedLoan.id, {
        condition: returnForm.condition,
        damageFee: Number(returnForm.damageFee),
        notes: returnForm.notes,
      });
      setIsReturnOpen(false);
      setSelectedLoan(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to process return');
    } finally {
      setProcessing(false);
    }
  };

  const handleRenew = async (loanId: string) => {
    if (window.confirm('Request a renewal extension for this checkout according to library policy?')) {
      try {
        await libraryService.renewBook(loanId);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Renewal not permitted');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Circulation Desk
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Issue books to students & faculty, record returns, inspect book condition, and grant renewal extensions.
          </p>
        </div>
        <Button onClick={() => setIsIssueOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Issue Book
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md flex gap-2">
          <Input
            placeholder="Search by patron USN, Faculty ID, or name..."
            value={searchPatron}
            onChange={(e) => setSearchPatron(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'ISSUED', 'OVERDUE', 'RENEWED', 'RETURNED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs transition ${
                statusFilter === st
                  ? 'bg-[#4E2478] text-white font-semibold'
                  : 'bg-white border border-[#E3DEE9] text-[#5C5468] hover:bg-[#EDE4F5]/40'
              }`}
            >
              {st === 'ALL' ? 'All Transactions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead className="bg-[#FAF8FC] border-b border-[#E3DEE9] text-[11px] font-semibold text-[#5C5468] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Book Title & ISBN</th>
                <th className="px-4 py-3">Patron (USN / Faculty ID)</th>
                <th className="px-4 py-3">Borrow Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Renewals</th>
                <th className="px-4 py-3">Status / Fine</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DEE9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#5C5468]">
                    Loading circulation data...
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#5C5468]">
                    No circulation records found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#EDE4F5]/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#1A1523] leading-tight">{loan.bookTitle}</p>
                      <p className="text-[11px] text-[#5C5468] font-mono mt-0.5">ISBN: {loan.bookIsbn}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1A1523]">{loan.memberName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4F5] text-[#4E2478] font-semibold border border-[#E3DEE9]">
                          {loan.memberRole}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-[#5C5468] mt-0.5">ID: {loan.memberIdentifier}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[#5C5468] font-mono text-[11px]">{loan.borrowDate}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`font-mono text-[11px] font-medium ${
                          loan.status === 'OVERDUE' ? 'text-[#D6264C] font-bold' : 'text-[#1A1523]'
                        }`}
                      >
                        {loan.dueDate}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#5C5468] font-mono text-[11px]">
                      {loan.renewalCount} / {loan.maxRenewalsAllowed}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            loan.status === 'RETURNED'
                              ? 'success'
                              : loan.status === 'OVERDUE'
                              ? 'danger'
                              : loan.status === 'RENEWED'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {loan.status}
                        </Badge>
                        {loan.fineAmount > 0 && (
                          <span className="text-[11px] font-heading font-bold text-[#D6264C]">
                            ₹{loan.fineAmount} fine
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {loan.status !== 'RETURNED' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleRenew(loan.id)}
                            icon={<RefreshCw className="w-3.5 h-3.5 text-[#4E2478]" />}
                            title="Renew loan extension"
                          >
                            Renew
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReturn(loan)}
                            icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#1C8A5C]" />}
                          >
                            Return
                          </Button>
                        </div>
                      )}
                      {loan.status === 'RETURNED' && (
                        <span className="text-[11px] text-[#5C5468] font-medium">
                          Returned ({loan.returnCondition})
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

      {/* Issue Book Modal */}
      <Modal isOpen={isIssueOpen} onClose={() => setIsIssueOpen(false)} title="Issue Book to Student or Faculty">
        <form onSubmit={handleIssueSubmit} className="space-y-3.5 text-xs font-body">
          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">
              Select Book Title (Must be currently available on shelf)
            </label>
            <select
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-2 text-xs text-[#1A1523] focus:border-[#4E2478]"
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
              required
            >
              <option value="">-- Choose available book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (Available: {b.availableCopies}) • [{b.shelfLocation}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">
              Patron USN (Students) or Faculty ID (Faculty)
            </label>
            <select
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-2 text-xs text-[#1A1523] focus:border-[#4E2478]"
              value={issueForm.memberIdentifier}
              onChange={(e) => setIssueForm({ ...issueForm, memberIdentifier: e.target.value })}
              required
            >
              <option value="">-- Select registered patron --</option>
              {members.map((m) => (
                <option key={m.id} value={m.identifier}>
                  {m.firstName} {m.lastName} • [{m.identifier}] • {m.role} ({m.borrowedBooksCount}/{m.maxBooksAllowed} held)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#5C5468] mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#4E2478]" />
              Automatic loan duration is applied (Students: 14 days, Faculty: 30 days).
            </p>
          </div>

          <Input
            label="Desk / Issue Notes (optional)"
            value={issueForm.notes}
            onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
            placeholder="e.g. Standard semester checkout"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsIssueOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={processing}>
              Confirm Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Return Book Modal */}
      <Modal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} title="Record Book Return & Condition">
        <form onSubmit={handleReturnSubmit} className="space-y-3.5 text-xs font-body">
          {selectedLoan && (
            <div className="p-3 bg-[#FAF8FC] rounded-lg border border-[#E3DEE9]">
              <p className="font-semibold text-[#1A1523]">{selectedLoan.bookTitle}</p>
              <p className="text-[11px] text-[#5C5468] mt-0.5">
                Borrower: {selectedLoan.memberName} ({selectedLoan.memberIdentifier}) • Due: {selectedLoan.dueDate}
              </p>
              {selectedLoan.status === 'OVERDUE' && (
                <div className="mt-2 text-xs font-semibold text-[#D6264C] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Overdue fine of ₹{selectedLoan.fineAmount} will be logged to patron account.
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">
              Physical Return Condition
            </label>
            <select
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
              value={returnForm.condition}
              onChange={(e) =>
                setReturnForm({
                  ...returnForm,
                  condition: e.target.value as 'GOOD' | 'DAMAGED' | 'LOST',
                })
              }
            >
              <option value="GOOD">Good / Normal Wear (No fine)</option>
              <option value="DAMAGED">Damaged / Torn Pages (Assess repair fee)</option>
              <option value="LOST">Lost by Patron (Replacement penalty)</option>
            </select>
          </div>

          {returnForm.condition !== 'GOOD' && (
            <Input
              label="Assessed Damage / Penalty Fee (₹)"
              type="number"
              value={returnForm.damageFee}
              onChange={(e) => setReturnForm({ ...returnForm, damageFee: parseFloat(e.target.value) || 0 })}
            />
          )}

          <Input
            label="Return Inspection Notes"
            value={returnForm.notes}
            onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
            placeholder="e.g. Checked by circulation staff"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsReturnOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={processing}>
              Process Return
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
