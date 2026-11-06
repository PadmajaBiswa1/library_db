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
  ArrowUpRight,
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
      iconBg: 'bg-[#EDE4F5] text-[#4E2478]',
      sub: 'All physical holdings',
    },
    {
      label: 'Available on Shelf',
      value: stats?.availableBooks ?? 0,
      icon: BookCheck,
      iconBg: 'bg-emerald-50 text-[#1C8A5C]',
      sub: 'Ready for circulation',
    },
    {
      label: 'Actively Issued',
      value: stats?.issuedBooks ?? 0,
      icon: Clock,
      iconBg: 'bg-sky-50 text-[#2563A6]',
      sub: 'In patron possession',
    },
    {
      label: 'Overdue Books',
      value: stats?.overdueBooks ?? 0,
      icon: AlertTriangle,
      iconBg: 'bg-[#FDE2E7] text-[#D6264C]',
      sub: 'Immediate action required',
    },
    {
      label: 'Registered Patrons',
      value: stats?.registeredMembers ?? 0,
      icon: Users,
      iconBg: 'bg-slate-100 text-[#5C5468]',
      sub: `${stats?.totalStudents || 0} Students • ${stats?.totalFaculty || 0} Faculty`,
    },
    {
      label: 'Active Reservations',
      value: stats?.activeReservationsCount ?? 0,
      icon: BookmarkCheck,
      iconBg: 'bg-amber-50 text-[#D98B16]',
      sub: 'Pending hold requests',
    },
    {
      label: 'Pending Fines',
      value: `₹${stats?.pendingFinesTotal ?? 0}`,
      icon: Receipt,
      iconBg: 'bg-[#FDE2E7] text-[#F30137]',
      sub: `₹${stats?.collectedFinesTotal ?? 0} total collected`,
    },
    {
      label: 'Digital Resources',
      value: stats?.totalDigitalResources ?? 0,
      icon: FileText,
      iconBg: 'bg-teal-50 text-[#0f766e]',
      sub: 'Open E-Books & Papers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
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
              className="bg-white rounded-xl border border-[#E3DEE9] p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-[#4E2478]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-[11px] font-semibold text-[#5C5468] uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="mt-1 font-heading font-bold text-2xl text-[#1A1523] tracking-tight">
                    {loading ? (
                      <span className="inline-block w-12 h-6 bg-[#EDE4F5] animate-pulse rounded" />
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 border border-[#E3DEE9] shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-2.5 pt-2 border-t border-[#E3DEE9] font-body text-[11px] text-[#5C5468] font-medium">
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Daily Library Activity & Recent Circulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Log */}
        <div className="bg-white rounded-xl border border-[#E3DEE9] p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3DEE9]">
            <div>
              <h2 className="font-heading font-semibold text-sm text-[#1A1523] tracking-tight">
                Daily Library Activities
              </h2>
              <p className="font-body text-xs text-[#5C5468]">Live operational ledger of circulation desk actions</p>
            </div>
            <Link
              to="/circulation"
              className="font-body text-xs font-semibold text-[#4E2478] hover:text-[#38195A] flex items-center gap-1"
            >
              Circulation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats?.dailyActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#FAF8FC] border border-[#E3DEE9] hover:bg-[#FAF8FC]/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs font-semibold text-[#1A1523]">{act.title}</span>
                    <Badge
                      variant={
                        act.action === 'ISSUE'
                          ? 'primary'
                          : act.action === 'RETURN'
                          ? 'success'
                          : act.action === 'RESERVE'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {act.action}
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-[#5C5468] mt-1">{act.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-body text-[11px] font-medium text-[#5C5468]">{act.actor}</p>
                  <p className="font-body text-[10px] text-[#5C5468]/70">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-[#E3DEE9] p-5 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between mb-0.5">
            <h2 className="font-heading font-semibold text-sm text-[#1A1523] tracking-tight">
              Catalog by Category
            </h2>
            <Link
              to="/books"
              className="font-body text-xs font-semibold text-[#4E2478] hover:text-[#38195A] flex items-center gap-1"
            >
              Browse
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="font-body text-xs text-[#5C5468] mb-4">Holdings distribution across disciplines</p>

          <div className="space-y-3">
            {stats?.categoryDistribution.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between font-body text-xs text-[#1A1523]">
                  <span className="font-medium truncate pr-2">{item.category}</span>
                  <span className="font-heading font-bold text-xs text-[#4E2478] shrink-0">{item.count}</span>
                </div>
                <div className="w-full bg-[#EDE4F5] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#4E2478] h-1.5 rounded-full transition-all"
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
