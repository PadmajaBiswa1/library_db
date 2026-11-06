import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { IDashboardStats } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  BookOpen,
  BookCheck,
  Clock,
  AlertTriangle,
  Users,
  BookmarkCheck,
  Receipt,
  FileText,
  Repeat,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metricCards = [
    {
      label: 'Total Catalog Copies',
      value: stats?.totalBooks ?? 0,
      icon: BookOpen,
      color: 'bg-blue-600',
      sub: 'All physical volumes',
    },
    {
      label: 'Available on Shelf',
      value: stats?.availableBooks ?? 0,
      icon: BookCheck,
      color: 'bg-emerald-600',
      sub: 'Ready for loan',
    },
    {
      label: 'Actively Issued',
      value: stats?.issuedBooks ?? 0,
      icon: Clock,
      color: 'bg-indigo-600',
      sub: 'In patrons possession',
    },
    {
      label: 'Overdue Books',
      value: stats?.overdueBooks ?? 0,
      icon: AlertTriangle,
      color: 'bg-rose-600',
      sub: 'Action required',
    },
    {
      label: 'Registered Patrons',
      value: stats?.registeredMembers ?? 0,
      icon: Users,
      color: 'bg-slate-700',
      sub: `${stats?.totalStudents || 0} Students • ${stats?.totalFaculty || 0} Faculty`,
    },
    {
      label: 'Active Reservations',
      value: stats?.activeReservationsCount ?? 0,
      icon: BookmarkCheck,
      color: 'bg-amber-600',
      sub: 'Waitlisted titles',
    },
    {
      label: 'Pending Fines',
      value: `₹${stats?.pendingFinesTotal ?? 0}`,
      icon: Receipt,
      color: 'bg-orange-600',
      sub: `₹${stats?.collectedFinesTotal ?? 0} collected`,
    },
    {
      label: 'Digital Resources',
      value: stats?.totalDigitalResources ?? 0,
      icon: FileText,
      color: 'bg-teal-600',
      sub: 'E-Books & Papers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time library operations, circulation tracking, and catalog capacity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Link to="/circulation">
            <Button size="sm" icon={<Repeat className="w-3.5 h-3.5" />}>
              Issue / Return
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Book
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-800 tracking-tight">
                    {loading ? <span className="inline-block w-12 h-6 bg-slate-100 animate-pulse rounded" /> : card.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.color} text-white flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Daily Library Activity & Recent Circulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Log */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Daily Library Activities</h2>
              <p className="text-xs text-slate-500">Live operational ledger of desk actions</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Chronological feed</span>
          </div>

          <div className="space-y-3">
            {stats?.dailyActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">{act.title}</span>
                    <Badge variant={act.action === 'ISSUE' ? 'info' : act.action === 'RETURN' ? 'success' : act.action === 'RESERVE' ? 'warning' : 'neutral'}>
                      {act.action}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{act.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-medium text-slate-400">{act.actor}</p>
                  <p className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-800 mb-0.5">Catalog by Category</h2>
          <p className="text-xs text-slate-500 mb-4">Holdings distribution across disciplines</p>

          <div className="space-y-3">
            {stats?.categoryDistribution.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-medium truncate pr-2">{item.category}</span>
                  <span className="text-slate-500 font-mono shrink-0">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-700 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((item.count / (stats?.totalBooks || 1)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
