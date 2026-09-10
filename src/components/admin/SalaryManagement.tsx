import React, { useState } from 'react';
import {
  Banknote,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Eye,
  X,
  CreditCard
} from 'lucide-react';
import { SalaryRecord, EmployeeItem } from '../../types.ts';

interface SalaryManagementProps {
  salaries: SalaryRecord[];
  employees: EmployeeItem[];
  onRefresh: () => void;
  onOpenCalculator: () => void;
}

export const SalaryManagement: React.FC<SalaryManagementProps> = ({
  salaries = [],
  employees = [],
  onRefresh,
  onOpenCalculator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingRecord, setViewingRecord] = useState<SalaryRecord | null>(null);

  const safeSalaries = Array.isArray(salaries) ? salaries : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  const getEmployee = (empId: number) => safeEmployees.find((e) => e.id === empId);

  const filteredSalaries = safeSalaries.filter((s) => {
    if (!s) return false;
    const emp = getEmployee(s.employeeId);
    const search = searchTerm.toLowerCase();
    const empName = (emp?.fullName || '').toLowerCase();
    const empCode = (emp?.employeeCode || '').toLowerCase();
    const sMonth = (s.salaryMonth || '').toLowerCase();
    const matchesSearch =
      empName.includes(search) ||
      empCode.includes(search) ||
      sMonth.includes(search);
    const matchesMonth = filterMonth === 'all' || s.salaryMonth === filterMonth;
    const matchesStatus = filterStatus === 'all' || s.paymentStatus === filterStatus;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const handleMarkPaid = async (id: number) => {
    const txRef = prompt('Enter Bank Transaction Ref / UTR number:', `SMSF-UTR-${Date.now().toString().slice(-6)}`);
    if (!txRef) return;

    try {
      const res = await fetch(`/api/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Bank Transfer',
          transactionRef: txRef,
        }),
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      alert('Error updating salary');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Salary & Payroll Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Disbursement registers, bank transfer records, overtime accounting, and official payslip archival.
          </p>
        </div>
        <button
          onClick={onOpenCalculator}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Calculate & Process New Salary
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by guard name, code, month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Salaries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Salary Month</th>
                <th className="py-3.5 px-4">Attendance (Pres / Total)</th>
                <th className="py-3.5 px-4">Basic + OT Pay</th>
                <th className="py-3.5 px-4">Net Payable (₹)</th>
                <th className="py-3.5 px-4">Disbursement Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No payroll disbursements found.
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((rec) => {
                  const emp = getEmployee(rec.employeeId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{emp?.fullName || 'Staff ID ' + rec.employeeId}</div>
                        <div className="text-[10px] text-blue-600 font-mono font-semibold">{emp?.employeeCode}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {rec.salaryMonth}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{rec.presentDays}</span> / {rec.workingDays} Days
                        {rec.absentDays > 0 && (
                          <span className="text-rose-600 text-[10px] block">({rec.absentDays} Absent)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>₹{Number(rec.basicSalary).toLocaleString('en-IN')}</div>
                        {Number(rec.overtimePay) > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">+₹{Number(rec.overtimePay).toLocaleString('en-IN')} OT</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-sm text-slate-900">
                          ₹{Number(rec.netSalary).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {rec.paymentStatus === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {rec.paymentStatus}
                        </span>
                        {rec.paymentDate && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{rec.paymentDate}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setViewingRecord(rec)}
                          title="View Payslip"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {rec.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => handleMarkPaid(rec.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Steel Men Security Force</h3>
                <p className="text-xs text-slate-500">Payslip for Month: {viewingRecord.salaryMonth}</p>
              </div>
              <button onClick={() => setViewingRecord(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Employee:</span>
                <span className="font-bold text-slate-900">{getEmployee(viewingRecord.employeeId)?.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Basic Salary:</span>
                <span className="font-semibold">₹{Number(viewingRecord.basicSalary).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-emerald-700">
                <span>Overtime Pay:</span>
                <span className="font-semibold">+₹{Number(viewingRecord.overtimePay).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-emerald-700">
                <span>Allowance:</span>
                <span className="font-semibold">+₹{Number(viewingRecord.allowance).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-rose-700">
                <span>Deductions:</span>
                <span className="font-semibold">-₹{Number(viewingRecord.deduction).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-t text-sm font-extrabold text-slate-900">
                <span>Net Disbursed:</span>
                <span className="text-blue-700">₹{Number(viewingRecord.netSalary).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Ref / UTR: {viewingRecord.transactionRef || 'NEFT Disbursed'} | Method: {viewingRecord.paymentMethod}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 border rounded-lg text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
