import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Plus } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [data, setData] = useState<{
    summary: {
      totalPhysicalCopies: number;
      availableOnShelf: number;
      activelyIssued: number;
      damagedCopiesCount: number;
      lostCopiesCount: number;
    };
    items: Array<{
      bookId: string;
      title: string;
      isbn: string;
      shelfLocation: string;
      totalCopies: number;
      availableCopies: number;
      conditionGood: number;
      conditionDamaged: number;
      conditionLost: number;
      stockStatus: string;
    }>;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [actionType, setActionType] = useState<'ADD_COPIES' | 'MARK_DAMAGED' | 'MARK_LOST'>('ADD_COPIES');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const audit = await libraryService.getInventoryAudit();
      setData(audit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) return;
    try {
      setSaving(true);
      await libraryService.adjustInventory({
        bookId: selectedBookId,
        action: actionType,
        quantity: Number(quantity),
        notes,
      });
      setIsAdjustOpen(false);
      setSelectedBookId('');
      setQuantity(1);
      setNotes('');
      loadInventory();
    } catch (err: any) {
      alert(err.message || 'Inventory adjustment failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Inventory & Stock Audit
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Physical stock tracking, condition health (good/damaged/lost), restock acquisitions, and discrepancy alerts.
          </p>
        </div>
        <Button
          onClick={() => {
            if (data?.items && data.items.length > 0) {
              setSelectedBookId(data.items[0].bookId);
            }
            setIsAdjustOpen(true);
          }}
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Adjust Stock
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
          <p className="font-body text-[10px] font-semibold text-[#5C5468] uppercase tracking-wide">Total Volumes</p>
          <p className="font-heading text-xl font-bold text-[#1A1523] mt-1">{data?.summary.totalPhysicalCopies || 0}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
          <p className="font-body text-[10px] font-semibold text-[#1C8A5C] uppercase tracking-wide">On Shelf</p>
          <p className="font-heading text-xl font-bold text-[#1C8A5C] mt-1">{data?.summary.availableOnShelf || 0}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
          <p className="font-body text-[10px] font-semibold text-[#4E2478] uppercase tracking-wide">Circulating</p>
          <p className="font-heading text-xl font-bold text-[#4E2478] mt-1">{data?.summary.activelyIssued || 0}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
          <p className="font-body text-[10px] font-semibold text-[#D98B16] uppercase tracking-wide">Damaged Copies</p>
          <p className="font-heading text-xl font-bold text-[#D98B16] mt-1">{data?.summary.damagedCopiesCount || 0}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
          <p className="font-body text-[10px] font-semibold text-[#D6264C] uppercase tracking-wide">Lost / Missing</p>
          <p className="font-heading text-xl font-bold text-[#D6264C] mt-1">{data?.summary.lostCopiesCount || 0}</p>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead className="bg-[#FAF8FC] border-b border-[#E3DEE9] text-[11px] font-semibold text-[#5C5468] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Book Title & ISBN</th>
                <th className="px-4 py-3">Shelf Location</th>
                <th className="px-4 py-3">Good Condition</th>
                <th className="px-4 py-3">Damaged</th>
                <th className="px-4 py-3">Lost</th>
                <th className="px-4 py-3">Total Copies</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DEE9]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#5C5468]">
                    Loading inventory audit data...
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#5C5468]">
                    No items in inventory.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.bookId} className="hover:bg-[#EDE4F5]/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#1A1523] leading-tight">{item.title}</p>
                      <p className="text-[11px] text-[#5C5468] font-mono mt-0.5">ISBN: {item.isbn}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#5C5468]">
                      {item.shelfLocation}
                    </td>
                    <td className="px-4 py-3.5 font-heading font-semibold text-[#1C8A5C]">
                      {item.conditionGood}
                    </td>
                    <td className="px-4 py-3.5 font-heading font-semibold text-[#D98B16]">
                      {item.conditionDamaged}
                    </td>
                    <td className="px-4 py-3.5 font-heading font-semibold text-[#D6264C]">
                      {item.conditionLost}
                    </td>
                    <td className="px-4 py-3.5 font-heading font-bold text-[#1A1523]">
                      {item.totalCopies} <span className="font-body text-[11px] font-normal text-[#5C5468]">({item.availableCopies} avail)</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          item.stockStatus === 'HEALTHY'
                            ? 'success'
                            : item.stockStatus === 'LOW_STOCK'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {item.stockStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBookId(item.bookId);
                          setIsAdjustOpen(true);
                        }}
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <Modal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} title="Adjust Stock or Report Condition">
        <form onSubmit={handleAdjustSubmit} className="space-y-3.5 text-xs font-body">
          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Select Book Title</label>
            <select
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              required
            >
              <option value="">-- Choose book to adjust --</option>
              {data?.items.map((b) => (
                <option key={b.bookId} value={b.bookId}>
                  {b.title} (Current Total: {b.totalCopies}, On Shelf: {b.availableCopies})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Action Type</label>
            <select
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
              value={actionType}
              onChange={(e) => setActionType(e.target.value as any)}
            >
              <option value="ADD_COPIES">Restock / Add New Physical Copies</option>
              <option value="MARK_DAMAGED">Report Copies as Damaged (Remove from Shelf)</option>
              <option value="MARK_LOST">Report Copies as Missing or Lost</option>
            </select>
          </div>

          <Input
            label="Quantity of Copies"
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />

          <Input
            label="Adjustment Audit Reason / Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Annual stock audit verification / Binding repair"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAdjustOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Confirm Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
