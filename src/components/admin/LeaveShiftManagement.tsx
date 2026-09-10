import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  X,
  Save
} from 'lucide-react';
import { LeaveRequest, ShiftItem, EmployeeItem } from '../../types.ts';

interface LeaveShiftManagementProps {
  leaves: LeaveRequest[];
  shifts: ShiftItem[];
  employees: EmployeeItem[];
  onRefresh: () => void;
}

export const LeaveShiftManagement: React.FC<LeaveShiftManagementProps> = ({
  leaves = [],
  shifts = [],
  employees = [],
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'leaves' | 'shifts'>('leaves');
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const safeLeaves = Array.isArray(leaves) ? leaves : [];
  const safeShifts = Array.isArray(shifts) ? shifts : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // New Shift Form
  const [shiftForm, setShiftForm] = useState({
    name: 'Evening Shift',
    startTime: '14:00',
    endTime: '22:00',
    description: 'Second operational post rotation',
  });

  // Apply Leave Form
  const [leaveForm, setLeaveForm] = useState({
    employeeId: safeEmployees[0]?.id || 1,
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: 'Family function at hometown',
  });

  const getEmployee = (id: number) => safeEmployees.find((e) => e.id === id);

  const handleUpdateLeaveStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approvedBy: 'Operations Commander' }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      alert('Error updating leave');
    }
  };

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftForm),
      });
      if (res.ok) {
        setShiftModalOpen(false);
        onRefresh();
      }
    } catch (e) {
      alert('Error creating shift');
    }
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveForm),
      });
      if (res.ok) {
        setLeaveModalOpen(false);
        onRefresh();
      }
    } catch (e) {
      alert('Error submitting leave');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave & Shift Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve guard leave applications, monitor relief manpower, and configure 24/7 security rotational shifts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'leaves' ? (
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Apply Leave Application
            </button>
          ) : (
            <button
              onClick={() => setShiftModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Shift Timing
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'leaves'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Leave Requests ({safeLeaves.filter((l) => l && l.status === 'Pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'shifts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Shift Schedules ({safeShifts.length})
        </button>
      </div>

      {/* Leaves View */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                safeLeaves.map((l) => {
                  const emp = getEmployee(l.employeeId);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{emp?.fullName || 'Staff ID ' + l.employeeId}</div>
                        <div className="text-[10px] text-blue-600 font-mono">{emp?.employeeCode}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {l.leaveType}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{l.startDate} to {l.endDate}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                        {l.reason}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : l.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {l.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdateLeaveStatus(l.id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateLeaveStatus(l.id, 'Rejected')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400">Decided</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Shifts View */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeShifts.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-950 font-mono font-bold text-sm">
                {s.startTime} — {s.endTime}
              </div>
              <p className="text-xs text-slate-500">{s.description || 'Standard site security shift rotation.'}</p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 24/7 Security Coverage Active
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Leave Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setLeaveModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Apply Leave Request</h3>

            <form onSubmit={handleCreateLeave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {safeEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason</label>
                <textarea
                  rows={2}
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {shiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setShiftModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Shift Schedule</h3>

            <form onSubmit={handleCreateShift} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Name *</label>
                <input
                  type="text"
                  required
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="e.g. Night Patrol Shift"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={shiftForm.description}
                  onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShiftModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Create Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
