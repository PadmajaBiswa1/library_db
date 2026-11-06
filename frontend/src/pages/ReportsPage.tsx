import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { Button } from '../components/common/Button';
import { Download, BookOpen, Layers } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getAnalyticsReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleExportCSV = () => {
    if (!report) return;

    // Build comprehensive CSV data
    let csv = 'Category,Metric,Value\n';
    csv += `Circulation,Total Transactions,${report.circulation.totalTransactionsEver}\n`;
    csv += `Circulation,Active Checkouts,${report.circulation.activeCheckouts}\n`;
    csv += `Circulation,Overdue Items,${report.circulation.overdueItems}\n`;
    csv += `Circulation,Return Rate (%),${report.circulation.returnRatePercentage}%\n`;
    csv += `Financials,Total Fines Accrued,₹${report.financials.totalFinesAccrued}\n`;
    csv += `Financials,Total Collected,₹${report.financials.totalCollected}\n`;
    csv += `Financials,Total Pending,₹${report.financials.totalPending}\n`;
    csv += `Financials,Total Waived,₹${report.financials.totalWaived}\n`;
    csv += `Inventory,Total Physical Copies,${report.inventorySummary.totalPhysicalCopies}\n`;
    csv += `Inventory,Available on Shelf,${report.inventorySummary.availableOnShelf}\n`;

    csv += '\nPopular Books Ranked,Category,Borrow Count\n';
    report.popularBooks.forEach((b: any) => {
      csv += `"${b.title.replace(/"/g, '""')}","${b.category}",${b.count}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `library_management_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports & Circulation Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional metrics, return fulfillment rates, fee collections, and most borrowed books ranking.
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          size="sm"
          icon={<Download className="w-4 h-4" />}
          disabled={!report}
        >
          Export CSV Report
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Generating analytics report...</div>
      ) : report ? (
        <>
          {/* Key Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Circulation Return Rate</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {report.circulation.returnRatePercentage}%
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                {report.circulation.successfullyReturned} of {report.circulation.totalTransactionsEver} loans returned
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Active Campus Checkouts</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {report.circulation.activeCheckouts}
              </p>
              <p className="text-[11px] text-amber-600 mt-1 font-medium">
                {report.circulation.overdueItems} currently overdue
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Fine Recovery Ratio</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                ₹{report.financials.totalCollected}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                ₹{report.financials.totalPending} pending • ₹{report.financials.totalWaived} waived
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Catalog Holdings</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {report.inventorySummary.totalPhysicalCopies}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Across {report.inventorySummary.totalCatalogTitles} unique catalog titles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Most Borrowed Books Ranking */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Most Borrowed Titles</h2>
                  <p className="text-xs text-slate-500">Popularity ranking based on student & faculty checkout history</p>
                </div>
                <BookOpen className="w-4 h-4 text-slate-400" />
              </div>

              {report.popularBooks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No circulation transactions logged yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {report.popularBooks.map((b: any, index: number) => (
                    <div key={b.isbn || index} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono font-bold text-xs text-slate-400">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{b.title}</p>
                          <p className="text-[10px] text-slate-400">{b.category}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {b.count} checkout{b.count === 1 ? '' : 's'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department-Wise Circulation */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Departmental Circulation</h2>
                  <p className="text-xs text-slate-500">Active books held across academic branches</p>
                </div>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>

              {report.departmentCirculation.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No departmental checkout data available.</p>
              ) : (
                <div className="space-y-3.5">
                  {report.departmentCirculation.map((dept: any) => (
                    <div key={dept.department} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span className="font-medium truncate pr-2">{dept.department}</span>
                        <span className="font-mono text-slate-500 shrink-0">
                          {dept.activeCheckouts} book{dept.activeCheckouts === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((dept.activeCheckouts / (report.circulation.activeCheckouts || 1)) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
