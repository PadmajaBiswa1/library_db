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
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Reports & Circulation Analytics
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Institutional metrics, return fulfillment rates, fee collections, and most borrowed books ranking.
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          size="sm"
          variant="accent"
          icon={<Download className="w-4 h-4" />}
          disabled={!report}
        >
          Export CSV Report
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#5C5468] text-xs font-body">Generating analytics report...</div>
      ) : report ? (
        <>
          {/* Key Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
              <p className="font-body text-[11px] font-semibold text-[#5C5468] uppercase">Circulation Return Rate</p>
              <p className="mt-1 font-heading font-bold text-2xl text-[#1A1523]">
                {report.circulation.returnRatePercentage}%
              </p>
              <p className="font-body text-[11px] text-[#1C8A5C] mt-1 font-medium">
                {report.circulation.successfullyReturned} of {report.circulation.totalTransactionsEver} loans returned
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
              <p className="font-body text-[11px] font-semibold text-[#5C5468] uppercase">Active Campus Checkouts</p>
              <p className="mt-1 font-heading font-bold text-2xl text-[#1A1523]">
                {report.circulation.activeCheckouts}
              </p>
              <p className="font-body text-[11px] text-[#D98B16] mt-1 font-medium">
                {report.circulation.overdueItems} currently overdue
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
              <p className="font-body text-[11px] font-semibold text-[#5C5468] uppercase">Fine Recovery Ratio</p>
              <p className="mt-1 font-heading font-bold text-2xl text-[#1A1523]">
                ₹{report.financials.totalCollected}
              </p>
              <p className="font-body text-[11px] text-[#5C5468] mt-1 font-medium">
                ₹{report.financials.totalPending} pending • ₹{report.financials.totalWaived} waived
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E3DEE9] shadow-xs">
              <p className="font-body text-[11px] font-semibold text-[#5C5468] uppercase">Catalog Holdings</p>
              <p className="mt-1 font-heading font-bold text-2xl text-[#1A1523]">
                {report.inventorySummary.totalPhysicalCopies}
              </p>
              <p className="font-body text-[11px] text-[#5C5468] mt-1 font-medium">
                Across {report.inventorySummary.totalCatalogTitles} unique catalog titles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Most Borrowed Books Ranking */}
            <div className="bg-white rounded-xl border border-[#E3DEE9] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3DEE9]">
                <div>
                  <h2 className="font-heading font-semibold text-sm text-[#1A1523]">Most Borrowed Titles</h2>
                  <p className="font-body text-xs text-[#5C5468]">Popularity ranking based on student & faculty checkout history</p>
                </div>
                <BookOpen className="w-4 h-4 text-[#4E2478]" />
              </div>

              {report.popularBooks.length === 0 ? (
                <p className="font-body text-xs text-[#5C5468] py-4">No circulation transactions logged yet.</p>
              ) : (
                <div className="divide-y divide-[#E3DEE9]">
                  {report.popularBooks.map((b: any, index: number) => (
                    <div key={b.isbn || index} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 font-body">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-heading font-bold text-xs text-[#4E2478]">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-[#1A1523] text-xs">{b.title}</p>
                          <p className="text-[10px] text-[#5C5468]">{b.category}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#EDE4F5] text-[#4E2478]">
                        {b.count} checkout{b.count === 1 ? '' : 's'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department-Wise Circulation */}
            <div className="bg-white rounded-xl border border-[#E3DEE9] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3DEE9]">
                <div>
                  <h2 className="font-heading font-semibold text-sm text-[#1A1523]">Departmental Circulation</h2>
                  <p className="font-body text-xs text-[#5C5468]">Active books held across academic branches</p>
                </div>
                <Layers className="w-4 h-4 text-[#4E2478]" />
              </div>

              {report.departmentCirculation.length === 0 ? (
                <p className="font-body text-xs text-[#5C5468] py-4">No departmental checkout data available.</p>
              ) : (
                <div className="space-y-3.5 font-body">
                  {report.departmentCirculation.map((dept: any) => (
                    <div key={dept.department} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#1A1523]">
                        <span className="font-medium truncate pr-2">{dept.department}</span>
                        <span className="font-heading font-bold text-xs text-[#4E2478] shrink-0">
                          {dept.activeCheckouts} book{dept.activeCheckouts === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="w-full bg-[#EDE4F5] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#4E2478] h-1.5 rounded-full"
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
