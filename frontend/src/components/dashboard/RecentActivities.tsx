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
      case 'ISSUED':
      case 'BORROWED':
      default:
        return 'warning';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E3DEE9] p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E3DEE9]">
        <div>
          <h3 className="font-heading font-semibold text-[#1A1523] text-sm">Recent Circulation Activity</h3>
          <p className="font-body text-xs text-[#5C5468]">Latest loan checkouts and returns</p>
        </div>
        <Link
          to="/circulation"
          className="font-body text-xs font-semibold text-[#4E2478] hover:text-[#38195A] flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#FAF8FC] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <p className="font-body text-sm text-[#5C5468] py-6 text-center">No recent activity recorded.</p>
      ) : (
        <div className="divide-y divide-[#E3DEE9]">
          {loans.map((loan) => (
            <div key={loan.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 font-body">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDE4F5] text-[#4E2478] flex items-center justify-center shrink-0">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1A1523] line-clamp-1">{loan.bookTitle}</p>
                  <p className="text-[11px] text-[#5C5468]">
                    Patron: <span className="text-[#1A1523] font-medium">{loan.memberName}</span> • Due:{' '}
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
