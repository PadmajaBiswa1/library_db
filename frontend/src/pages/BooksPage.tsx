import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IBook, BookCategory } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  BookOpen,
  Filter,
} from 'lucide-react';

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    edition: '1st Edition',
    category: 'Computer Science' as BookCategory,
    subject: '',
    publicationYear: 2024,
    totalCopies: 4,
    block: 'Block-A',
    rack: 'Rack-01',
    shelf: 'Shelf-1',
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getBooks({
        search: search || undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        availability: availabilityFilter !== 'ALL' ? availabilityFilter : undefined,
      });
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [categoryFilter, availabilityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this book title from catalog?')) {
      try {
        await libraryService.deleteBook(id);
        loadBooks();
      } catch (err: any) {
        alert(err.message || 'Failed to delete book');
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await libraryService.createBook(form);
      setIsAddOpen(false);
      setForm({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        edition: '1st Edition',
        category: 'Computer Science',
        subject: '',
        publicationYear: 2024,
        totalCopies: 4,
        block: 'Block-A',
        rack: 'Rack-01',
        shelf: 'Shelf-1',
      });
      loadBooks();
    } catch (err: any) {
      alert(err.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (book: IBook) => {
    setSelectedBook(book);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      edition: book.edition,
      category: book.category,
      subject: book.subject,
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      block: book.block,
      rack: book.rack,
      shelf: book.shelf,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    try {
      setSaving(true);
      await libraryService.updateBook(selectedBook.id, form);
      setIsEditOpen(false);
      setSelectedBook(null);
      loadBooks();
    } catch (err: any) {
      alert(err.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Book Catalog & Management
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Maintain catalog records, physical shelf coordinates, editions, and inventory counts.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Add New Book
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md flex gap-2">
          <Input
            placeholder="Search by title, author, ISBN, publisher, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-body text-xs text-[#5C5468]">
            <Filter className="w-3.5 h-3.5 text-[#4E2478]" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#E3DEE9] font-body text-xs px-2.5 py-1.5 bg-white text-[#1A1523] focus:outline-none focus:border-[#4E2478]"
          >
            <option value="ALL">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
            <option value="Mechanical Eng">Mechanical Eng</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Management & Business">Management & Business</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="rounded-lg border border-[#E3DEE9] font-body text-xs px-2.5 py-1.5 bg-white text-[#1A1523] focus:outline-none focus:border-[#4E2478]"
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available on Shelf</option>
            <option value="ISSUED">All Copies Issued</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead className="bg-[#FAF8FC] border-b border-[#E3DEE9] text-[11px] font-semibold text-[#5C5468] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Book Details</th>
                <th className="px-4 py-3">Category & Subject</th>
                <th className="px-4 py-3">Publisher & Edition</th>
                <th className="px-4 py-3">Shelf Location</th>
                <th className="px-4 py-3">Copies</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DEE9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#5C5468]">
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#5C5468]">
                    No books found matching the query.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-[#EDE4F5]/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#EDE4F5] text-[#4E2478] flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1523] leading-tight">{book.title}</p>
                          <p className="text-[11px] text-[#5C5468] mt-0.5">
                            By {book.author} • ISBN: <span className="font-mono">{book.isbn}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#1A1523]">{book.category}</p>
                      <p className="text-[11px] text-[#5C5468]">{book.subject}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[#5C5468]">
                      <p className="text-[#1A1523]">{book.publisher}</p>
                      <p className="text-[11px] text-[#5C5468]">{book.edition} ({book.publicationYear})</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] bg-[#FAF8FC] px-2 py-1 rounded border border-[#E3DEE9] text-[#1A1523]">
                        {book.shelfLocation}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-heading font-bold text-sm text-[#1A1523]">{book.availableCopies}</span>
                      <span className="text-[#5C5468] text-[11px]"> / {book.totalCopies}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                        {book.availableCopies > 0 ? 'AVAILABLE' : 'ISSUED'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="p-1 text-[#5C5468] hover:text-[#4E2478] transition"
                          title="Edit Book Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1 text-[#5C5468] hover:text-[#D6264C] transition"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
          setSelectedBook(null);
        }}
        title={isEditOpen ? 'Edit Book Details' : 'Add New Book to Catalog'}
      >
        <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit} className="space-y-3.5 text-xs font-body">
          <Input
            label="Book Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Operating Systems: Three Easy Pieces"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Author(s)"
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="e.g. Remzi Arpaci-Dusseau"
            />
            <Input
              label="ISBN"
              required
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              placeholder="e.g. 978-1985086593"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Publisher"
              required
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              placeholder="e.g. Arpaci-Dusseau Books"
            />
            <Input
              label="Edition"
              required
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
              placeholder="e.g. 1st Edition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Category</label>
              <select
                className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as BookCategory })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Management & Business">Management & Business</option>
              </select>
            </div>
            <Input
              label="Subject / Topic"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Operating Systems"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Publication Year"
              type="number"
              required
              value={form.publicationYear}
              onChange={(e) => setForm({ ...form, publicationYear: parseInt(e.target.value) || 2024 })}
            />
            <Input
              label="Total Copies"
              type="number"
              min="1"
              required
              value={form.totalCopies}
              onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Block"
              required
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
              placeholder="Block-A"
            />
            <Input
              label="Rack"
              required
              value={form.rack}
              onChange={(e) => setForm({ ...form, rack: e.target.value })}
              placeholder="Rack-02"
            />
            <Input
              label="Shelf"
              required
              value={form.shelf}
              onChange={(e) => setForm({ ...form, shelf: e.target.value })}
              placeholder="Shelf-3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              {isEditOpen ? 'Update Book' : 'Add to Catalog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
