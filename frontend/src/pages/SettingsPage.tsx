import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { ILibraryPolicy } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [policies, setPolicies] = useState<ILibraryPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    libraryService
      .getPolicies()
      .then((data) => {
        setPolicies(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policies) return;
    try {
      setSaving(true);
      setSavedSuccess(false);
      const updated = await libraryService.updatePolicies(policies);
      setPolicies(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update policies');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !policies) {
    return <div className="text-center py-12 text-[#5C5468] text-xs font-body">Loading library policies...</div>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Library Settings & Policies
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            Configure circulation loan rules, fine rates per day, renewal limitations, operational hours, and holiday calendars.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-[#1C8A5C] font-body font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <Check className="w-4 h-4 text-[#1C8A5C]" />
            Policies updated successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Circulation Durations & Limits */}
        <Card title="Borrowing Rules & Loan Durations" subtitle="Role-specific circulation policies">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
            <Input
              label="Student Loan Duration (Days)"
              type="number"
              min="1"
              required
              value={policies.studentLoanDays}
              onChange={(e) =>
                setPolicies({ ...policies, studentLoanDays: parseInt(e.target.value) || 14 })
              }
            />

            <Input
              label="Faculty Loan Duration (Days)"
              type="number"
              min="1"
              required
              value={policies.facultyLoanDays}
              onChange={(e) =>
                setPolicies({ ...policies, facultyLoanDays: parseInt(e.target.value) || 30 })
              }
            />

            <Input
              label="Student Maximum Simultaneous Books"
              type="number"
              min="1"
              required
              value={policies.studentMaxBooks}
              onChange={(e) =>
                setPolicies({ ...policies, studentMaxBooks: parseInt(e.target.value) || 3 })
              }
            />

            <Input
              label="Faculty Maximum Simultaneous Books"
              type="number"
              min="1"
              required
              value={policies.facultyMaxBooks}
              onChange={(e) =>
                setPolicies({ ...policies, facultyMaxBooks: parseInt(e.target.value) || 6 })
              }
            />

            <Input
              label="Maximum Renewal Limit per Loan"
              type="number"
              min="0"
              required
              value={policies.maxRenewalsAllowed}
              onChange={(e) =>
                setPolicies({ ...policies, maxRenewalsAllowed: parseInt(e.target.value) || 2 })
              }
            />
          </div>
        </Card>

        {/* Fines and Penalties */}
        <Card title="Fines & Penalty Rates" subtitle="Overdue assessment calculations">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-body">
            <Input
              label="Overdue Fine Rate (₹ per day)"
              type="number"
              min="0"
              step="0.5"
              required
              value={policies.finePerDay}
              onChange={(e) =>
                setPolicies({ ...policies, finePerDay: parseFloat(e.target.value) || 2 })
              }
            />

            <Input
              label="Standard Damage Assessment Fee (₹)"
              type="number"
              min="0"
              required
              value={policies.damagePenaltyRate}
              onChange={(e) =>
                setPolicies({ ...policies, damagePenaltyRate: parseFloat(e.target.value) || 15 })
              }
            />

            <Input
              label="Lost Book Replacement Multiplier (x)"
              type="number"
              min="1"
              required
              value={policies.lostBookMultiplier}
              onChange={(e) =>
                setPolicies({ ...policies, lostBookMultiplier: parseInt(e.target.value) || 2 })
              }
            />
          </div>
        </Card>

        {/* Library Operational Timings */}
        <Card title="Operating Hours & Access Timings" subtitle="Campus opening and closing schedules">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-body">
            <Input
              label="Weekdays (Mon - Fri)"
              required
              value={policies.libraryTimings.weekdays}
              onChange={(e) =>
                setPolicies({
                  ...policies,
                  libraryTimings: {
                    ...policies.libraryTimings,
                    weekdays: e.target.value,
                  },
                })
              }
            />

            <Input
              label="Saturdays"
              required
              value={policies.libraryTimings.saturdays}
              onChange={(e) =>
                setPolicies({
                  ...policies,
                  libraryTimings: {
                    ...policies.libraryTimings,
                    saturdays: e.target.value,
                  },
                })
              }
            />

            <Input
              label="Sundays & Holidays"
              required
              value={policies.libraryTimings.sundays}
              onChange={(e) =>
                setPolicies({
                  ...policies,
                  libraryTimings: {
                    ...policies.libraryTimings,
                    sundays: e.target.value,
                  },
                })
              }
            />
          </div>
        </Card>

        {/* Holiday Schedule */}
        <Card title="Observed Academic Holidays" subtitle="Dates when circulation desk is closed">
          <div className="space-y-2 text-xs font-body">
            {policies.holidays.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF8FC] border border-[#E3DEE9] rounded-lg">
                <span className="font-semibold text-[#1A1523]">{h.name}</span>
                <span className="font-mono text-[#5C5468]">{h.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={saving}>
            Save All Policies
          </Button>
        </div>
      </form>
    </div>
  );
};
