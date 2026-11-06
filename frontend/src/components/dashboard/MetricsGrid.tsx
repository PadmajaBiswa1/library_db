import React from 'react';
import { BookOpen, BookCheck, Clock, Users } from 'lucide-react';
import { IDashboardStats } from '../../types';

interface MetricsGridProps {
  stats: IDashboardStats | null;
  loading: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Book Inventory',
      value: stats?.totalBooks ?? 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      badge: 'All titles & copies',
    },
    {
      title: 'Available on Shelf',
      value: stats?.availableBooks ?? 0,
      icon: BookCheck,
      color: 'bg-emerald-500',
      badge: 'Ready to borrow',
    },
    {
      title: 'Active Checkouts',
      value: stats?.issuedBooks ?? 0,
      icon: Clock,
      color: 'bg-amber-500',
      badge: `${stats?.overdueBooks || 0} overdue`,
    },
    {
      title: 'Registered Members',
      value: stats?.registeredMembers ?? 0,
      icon: Users,
      color: 'bg-indigo-500',
      badge: 'Active patrons',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="mt-2 text-2xl font-bold text-slate-800">
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-lg ${card.color} text-white flex items-center justify-center shadow`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
              <span className="font-medium text-slate-700">{card.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
