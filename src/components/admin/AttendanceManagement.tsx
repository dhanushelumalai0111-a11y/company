import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  Filter,
  Check,
  X,
  Clock,
  Save,
  AlertCircle,
  Building,
  UserCheck
} from 'lucide-react';
import { EmployeeItem, ClientItem, AttendanceRecord } from '../../types.ts';

interface AttendanceManagementProps {
  employees: EmployeeItem[];
  clients: ClientItem[];
  onRefreshDashboard?: () => void;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  employees = [],
  clients = [],
  onRefreshDashboard,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Local draft state for quick editing
  const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});
  const [overtimeDrafts, setOvertimeDrafts] = useState<Record<number, string>>({});

  const fetchAttendance = async (date: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${date}`);
      if (res.ok) {
        const data: AttendanceRecord[] = await res.json();
        setAttendanceRecords(Array.isArray(data) ? data : []);

        // Populate drafts
        const sDrafts: Record<number, string> = {};
        const oDrafts: Record<number, string> = {};
        (Array.isArray(data) ? data : []).forEach((rec) => {
          sDrafts[rec.employeeId] = rec.status;
          oDrafts[rec.employeeId] = rec.overtimeHours || '0';
        });
        setStatusDrafts(sDrafts);
        setOvertimeDrafts(oDrafts);
      }
    } catch (e) {
      console.error('Error fetching attendance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const safeEmployees = Array.isArray(employees) ? employees : [];
  const activeEmployees = safeEmployees.filter((e) => {
    if (!e) return false;
    if (e.status === 'Inactive') return false;
    if (selectedClient !== 'all' && e.assignedClientId !== Number(selectedClient)) return false;
    return true;
  });

  const getClientName = (clientId?: number | null) => {
    if (!clientId) return 'Unassigned';
    const c = (Array.isArray(clients) ? clients : []).find((item) => item.id === clientId);
    return c ? c.companyName : 'Site Deployment';
  };

  const handleMarkStatus = async (emp: EmployeeItem, status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Weekly Off') => {
    setSavingId(emp.id);
    const ot = overtimeDrafts[emp.id] || '0';

    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: emp.id,
          clientId: emp.assignedClientId,
          date: selectedDate,
          status,
          overtimeHours: ot,
        }),
      });

      if (res.ok) {
        setStatusDrafts((prev) => ({ ...prev, [emp.id]: status }));
        fetchAttendance(selectedDate);
        if (onRefreshDashboard) onRefreshDashboard();
      }
    } catch (e) {
      alert('Failed to record attendance');
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!confirm(`Mark all ${activeEmployees.length} personnel as Present for ${selectedDate}?`)) return;
    setLoading(true);
    for (const emp of activeEmployees) {
      try {
        await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: emp.id,
            clientId: emp.assignedClientId,
            date: selectedDate,
            status: 'Present',
            overtimeHours: overtimeDrafts[emp.id] || '0',
          }),
        });
      } catch (e) {}
    }
    await fetchAttendance(selectedDate);
    if (onRefreshDashboard) onRefreshDashboard();
    setLoading(false);
  };

  // Calculations
  const presentCount = Object.values(statusDrafts).filter((s) => s === 'Present').length;
  const absentCount = Object.values(statusDrafts).filter((s) => s === 'Absent').length;
  const leaveCount = Object.values(statusDrafts).filter((s) => s === 'Leave').length;
  const totalMarked = Object.keys(statusDrafts).length;
  const rate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daily Attendance & Muster Roll</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record on-site guard and staff muster, track absenteeism, and calculate billable overtime hours.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Mark All Present
          </button>
        </div>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Attendance Date:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              Client Site:
            </span>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none"
            >
              <option value="all">All Sites ({clients.length})</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Present: <strong>{presentCount}</strong>
          </span>
          <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            Absent: <strong>{absentCount}</strong>
          </span>
          <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Leave: <strong>{leaveCount}</strong>
          </span>
          <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Rate: <strong>{rate}%</strong>
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Service & Role</th>
                <th className="py-3.5 px-4">Client Premise</th>
                <th className="py-3.5 px-4">Overtime (Hrs)</th>
                <th className="py-3.5 px-4 text-center">Muster Roll Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No employees matching the selected client filter.
                  </td>
                </tr>
              ) : (
                activeEmployees.map((emp) => {
                  const currentStatus = statusDrafts[emp.id] || 'Unmarked';
                  const ot = overtimeDrafts[emp.id] || '0';
                  const isSaving = savingId === emp.id;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            <img
                              src={emp.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={emp.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{emp.fullName}</div>
                            <div className="text-[10px] text-blue-600 font-mono font-semibold">{emp.employeeCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{emp.designation}</div>
                        <div className="text-[11px] text-slate-400">{emp.serviceType}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {getClientName(emp.assignedClientId)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="12"
                            step="0.5"
                            value={ot}
                            onChange={(e) =>
                              setOvertimeDrafts((prev) => ({ ...prev, [emp.id]: e.target.value }))
                            }
                            className="w-16 px-2 py-1 border rounded text-xs text-center"
                          />
                          <span className="text-[10px] text-slate-400">hrs</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleMarkStatus(emp, 'Present')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleMarkStatus(emp, 'Absent')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleMarkStatus(emp, 'Leave')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              currentStatus === 'Leave'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            Leave
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleMarkStatus(emp, 'Weekly Off')}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-all cursor-pointer ${
                              currentStatus === 'Weekly Off'
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            Week Off
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
