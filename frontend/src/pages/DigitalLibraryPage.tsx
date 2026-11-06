import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { IDigitalResource, DigitalResourceType, BookCategory } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  FileText,
  Download,
  Plus,
  Search,
  Trash2,
  Filter,
} from 'lucide-react';

export const DigitalLibraryPage: React.FC = () => {
  const [resources, setResources] = useState<IDigitalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: 'Computer Science' as BookCategory,
    subject: '',
    resourceType: 'E_BOOK' as DigitalResourceType,
    fileFormat: 'PDF' as 'PDF' | 'EPUB' | 'LINK',
    fileUrl: '',
    fileSize: '5.2 MB',
    publishedYear: 2024,
    description: '',
  });

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getDigitalResources({
        search: search || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [typeFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadResources();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await libraryService.createDigitalResource(form);
      setIsModalOpen(false);
      setForm({
        title: '',
        author: '',
        category: 'Computer Science',
        subject: '',
        resourceType: 'E_BOOK',
        fileFormat: 'PDF',
        fileUrl: '',
        fileSize: '5.2 MB',
        publishedYear: 2024,
        description: '',
      });
      loadResources();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadClick = async (resource: IDigitalResource) => {
    try {
      await libraryService.recordDownload(resource.id);
      window.open(resource.fileUrl, '_blank');
      loadResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this digital asset from repository?')) {
      try {
        await libraryService.deleteDigitalResource(id);
        loadResources();
      } catch (err: any) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Digital Library & Learning Resources
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Institutional repository for Open Access e-books, research publications, journals, and lecture notes.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Upload Digital Asset
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md flex gap-2">
          <Input
            placeholder="Search by title, author, or subject keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-body text-xs text-[#5C5468]">
            <Filter className="w-3.5 h-3.5 text-[#4E2478]" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#E3DEE9] font-body text-xs px-2.5 py-1.5 bg-white text-[#1A1523] focus:border-[#4E2478]"
          >
            <option value="ALL">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
            <option value="Mechanical Eng">Mechanical Eng</option>
            <option value="Mathematics">Mathematics</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[#E3DEE9] font-body text-xs px-2.5 py-1.5 bg-white text-[#1A1523] focus:border-[#4E2478]"
          >
            <option value="ALL">All Types</option>
            <option value="E_BOOK">E-Books</option>
            <option value="RESEARCH_PAPER">Research Papers</option>
            <option value="JOURNAL">Journals</option>
            <option value="COURSE_MATERIAL">Course Materials</option>
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#5C5468] text-xs font-body">Loading digital resources...</div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E3DEE9] p-12 text-center text-[#5C5468] text-xs font-body">
          No digital learning resources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs flex flex-col justify-between hover:border-[#4E2478]/30 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#EDE4F5] text-[#4E2478] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-[#1A1523] text-sm leading-snug">{item.title}</h3>
                      <p className="font-body text-[11px] text-[#5C5468] mt-0.5">
                        By {item.author} • {item.publishedYear}
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary">{item.resourceType.replace('_', ' ')}</Badge>
                </div>

                <p className="font-body text-xs text-[#5C5468] mt-3 line-clamp-2">{item.description}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-body">
                  <span className="bg-[#EDE4F5] text-[#4E2478] px-2 py-0.5 rounded font-medium">
                    {item.category}
                  </span>
                  <span className="bg-[#FAF8FC] text-[#5C5468] border border-[#E3DEE9] px-2 py-0.5 rounded">
                    {item.subject}
                  </span>
                  <span className="bg-[#FAF8FC] text-[#5C5468] px-2 py-0.5 rounded font-mono border border-[#E3DEE9]">
                    {item.fileFormat} • {item.fileSize}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E3DEE9] flex items-center justify-between">
                <span className="font-body text-[11px] text-[#5C5468] font-mono">
                  {item.downloadCount} reads/downloads
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#5C5468] hover:text-[#D6264C] transition"
                    title="Remove resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadClick(item)}
                    icon={<Download className="w-3.5 h-3.5 text-[#4E2478]" />}
                  >
                    Access Document
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Resource Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Digital Learning Resource">
        <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs font-body">
          <Input
            label="Document / Paper Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Distributed Consensus in Cloud Systems"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Author(s) / Publisher"
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="e.g. Leslie Lamport"
            />
            <Input
              label="Published Year"
              type="number"
              required
              value={form.publishedYear}
              onChange={(e) => setForm({ ...form, publishedYear: parseInt(e.target.value) || 2024 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Resource Category</label>
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
                <option value="Philosophy">Philosophy</option>
                <option value="Management & Business">Management & Business</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Resource Type</label>
              <select
                className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
                value={form.resourceType}
                onChange={(e) => setForm({ ...form, resourceType: e.target.value as DigitalResourceType })}
              >
                <option value="E_BOOK">E-Book</option>
                <option value="RESEARCH_PAPER">Research Paper</option>
                <option value="JOURNAL">Journal</option>
                <option value="COURSE_MATERIAL">Course Material / Notes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject / Topic"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Distributed Algorithms"
            />
            <Input
              label="File Format & Size"
              value={form.fileSize}
              onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
              placeholder="e.g. 8.4 MB"
            />
          </div>

          <Input
            label="Direct PDF / Document URL or DOI link"
            type="url"
            required
            value={form.fileUrl}
            onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
            placeholder="https://..."
          />

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">Abstract / Summary</label>
            <textarea
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief summary of syllabus coverage or paper highlights"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Add to Repository
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
