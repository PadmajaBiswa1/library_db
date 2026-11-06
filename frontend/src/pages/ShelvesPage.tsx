import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IShelfLocation, IBook } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { MapPin, Plus, BookOpen } from 'lucide-react';

export const ShelvesPage: React.FC = () => {
  const [shelves, setShelves] = useState<IShelfLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<IShelfLocation | null>(null);
  const [shelfBooks, setShelfBooks] = useState<IBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    block: 'Block-A',
    floor: 'Floor-1 (Ground Floor)',
    rack: 'Rack-03',
    shelfNumber: 'Shelf-1 to 5',
    categorySpecialization: 'General Engineering',
    capacity: 250,
    description: '',
  });

  const loadShelves = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getShelves();
      setShelves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelves();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await libraryService.createShelf({
        ...form,
        capacity: Number(form.capacity),
      });
      setIsAddOpen(false);
      setForm({
        block: 'Block-A',
        floor: 'Floor-1 (Ground Floor)',
        rack: 'Rack-03',
        shelfNumber: 'Shelf-1 to 5',
        categorySpecialization: 'General Engineering',
        capacity: 250,
        description: '',
      });
      loadShelves();
    } catch (err: any) {
      alert(err.message || 'Failed to add rack location');
    } finally {
      setSaving(false);
    }
  };

  const handleViewBooks = async (shelf: IShelfLocation) => {
    setSelectedShelf(shelf);
    setIsBooksOpen(true);
    setBooksLoading(true);
    try {
      const books = await libraryService.getBooksOnShelf(shelf.block, shelf.rack);
      setShelfBooks(books);
    } catch (err) {
      console.error(err);
    } finally {
      setBooksLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Shelf & Rack Management
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Physical layout blueprint, wing blocks, floor partitions, rack assignments, and shelf capacities.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Add Rack Location
        </Button>
      </div>

      {/* Grid of Shelves */}
      {loading ? (
        <div className="text-center py-10 text-[#5C5468] text-xs font-body">Loading physical layout...</div>
      ) : shelves.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E3DEE9] p-8 text-center text-[#5C5468] text-xs font-body">
          No shelf coordinates configured.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelves.map((shelf) => {
            const usagePercent = Math.min(100, Math.round((shelf.currentCount / (shelf.capacity || 1)) * 100));
            return (
              <div
                key={shelf.id}
                className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs flex flex-col justify-between hover:border-[#4E2478]/30 transition"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EDE4F5] text-[#4E2478] border border-[#E3DEE9]">
                        {shelf.block} • {shelf.rack}
                      </span>
                      <h3 className="font-heading font-semibold text-[#1A1523] text-sm mt-1.5">{shelf.categorySpecialization}</h3>
                      <p className="font-body text-[11px] text-[#5C5468]">{shelf.floor} • {shelf.shelfNumber}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8FC] text-[#4E2478] flex items-center justify-center shrink-0 border border-[#E3DEE9]">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="font-body text-xs text-[#5C5468] mt-3 line-clamp-2">{shelf.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E3DEE9]">
                  <div className="flex justify-between font-body text-xs text-[#5C5468] mb-1">
                    <span>Rack Occupancy</span>
                    <span className="font-heading font-semibold text-[#1A1523]">
                      {shelf.currentCount} / {shelf.capacity} ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EDE4F5] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        usagePercent > 90 ? 'bg-[#D6264C]' : usagePercent > 70 ? 'bg-[#D98B16]' : 'bg-[#4E2478]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewBooks(shelf)}
                      icon={<BookOpen className="w-3.5 h-3.5 text-[#4E2478]" />}
                    >
                      View Assigned Books
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Books on Shelf Modal */}
      <Modal
        isOpen={isBooksOpen}
        onClose={() => {
          setIsBooksOpen(false);
          setSelectedShelf(null);
        }}
        title={`Books Shelved at ${selectedShelf?.block} / ${selectedShelf?.rack}`}
      >
        <div className="space-y-3 text-xs font-body">
          {booksLoading ? (
            <p className="text-[#5C5468] text-center py-4">Scanning shelf coordinates...</p>
          ) : shelfBooks.length === 0 ? (
            <p className="text-[#5C5468] text-center py-4">No books currently cataloged in this rack.</p>
          ) : (
            <div className="divide-y divide-[#E3DEE9] max-h-80 overflow-y-auto">
              {shelfBooks.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-[#1A1523]">{b.title}</p>
                    <p className="text-[11px] text-[#5C5468] mt-0.5">
                      {b.author} • <span className="font-mono">{b.shelf}</span>
                    </p>
                  </div>
                  <span className="font-mono text-[#1A1523] bg-[#FAF8FC] px-2 py-0.5 rounded border border-[#E3DEE9]">
                    {b.availableCopies}/{b.totalCopies} on shelf
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[#E3DEE9]">
            <Button size="sm" variant="outline" onClick={() => setIsBooksOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Shelf Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Physical Rack / Shelf">
        <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs font-body">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Block / Wing"
              required
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
              placeholder="e.g. Block-B"
            />
            <Input
              label="Floor Level"
              required
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              placeholder="e.g. Floor-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rack Identifier"
              required
              value={form.rack}
              onChange={(e) => setForm({ ...form, rack: e.target.value })}
              placeholder="e.g. Rack-04"
            />
            <Input
              label="Shelf Range / Number"
              required
              value={form.shelfNumber}
              onChange={(e) => setForm({ ...form, shelfNumber: e.target.value })}
              placeholder="e.g. Shelf-1 to 5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject / Category Specialization"
              required
              value={form.categorySpecialization}
              onChange={(e) => setForm({ ...form, categorySpecialization: e.target.value })}
              placeholder="e.g. Robotics & Mechatronics"
            />
            <Input
              label="Maximum Book Capacity"
              type="number"
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 200 })}
            />
          </div>

          <Input
            label="Location Notes / Visual Landmarks"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Near east reading alcove, next to staircase"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Register Shelf
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
