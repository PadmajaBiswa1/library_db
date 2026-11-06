import React from 'react';
import { ILoan } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowUpRight, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivitiesProps {
  loans: ILoan[];
  loading: boolean;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ loans, loading }) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'RETURNED':
        return 'success';
      case 'OVERDUE':
        return 'danger';
      case 'BORROWED':
      default:
        return 'warning';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Recent Circulation Activity</h3>
          <p className="text-xs text-slate-500">Latest loan checkouts and returns</p>
        </div>
        <Link
          to="/loans"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">No recent activity recorded.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {loans.map((loan) => (
            <div key={loan.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{loan.bookTitle}</p>
                  <p className="text-xs text-slate-500">
                    Patron: <span className="text-slate-700 font-medium">{loan.memberName}</span> • Due:{' '}
                    {loan.dueDate}
                  </p>
                </div>
              </div>
              <Badge variant={getBadgeVariant(loan.status)}>{loan.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
