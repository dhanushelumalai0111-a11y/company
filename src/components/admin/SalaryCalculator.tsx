import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  User,
  IndianRupee,
  Receipt,
  CheckCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { EmployeeItem, CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface SalaryCalculatorProps {
  employees: EmployeeItem[];
  settings?: CompanySettings;
  onSavedPayroll?: () => void;
}

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  employees,
  settings,
  onSavedPayroll,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<number>(employees[0]?.id || 1);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');

  const [workingDays, setWorkingDays] = useState<number>(30);
  const [presentDays, setPresentDays] = useState<number>(26);
  const [leaveDays, setLeaveDays] = useState<number>(3);
  const [absentDays, setAbsentDays] = useState<number>(1);
  const [overtimeHours, setOvertimeHours] = useState<number>(12);
  const [allowance, setAllowance] = useState<number>(1200);
  const [advance, setAdvance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
  const [notes, setNotes] = useState<string>('Processed on time via NEFT');

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentEmp = employees.find((e) => e.id === Number(selectedEmpId)) || employees[0];
  const basicSalary = Number(currentEmp?.salary || 18000);

  // Formulas
  const perDayRate = basicSalary / (workingDays || 30);
  const perHourRate = perDayRate / 8;
  const overtimePay = Math.round(overtimeHours * perHourRate * 1.5);
  const absentDeduction = Math.round(absentDays * perDayRate);
  const grossEarnings = basicSalary + overtimePay + allowance;
  const totalDeductions = absentDeduction + advance;
  const netSalary = Math.round(grossEarnings - totalDeductions);

  const handleCalculateFromDb = async () => {
    if (!currentEmp) return;
    setLoading(true);
    try {
      const res = await fetch('/api/salaries/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: currentEmp.id, month: selectedMonth }),
      });
      if (res.ok) {
        const data = await res.json();
        setPresentDays(data.presentDays || 26);
        setLeaveDays(data.leaveDays || 3);
        setAbsentDays(data.absentDays || 1);
        setOvertimeHours(data.overtimeHours || 8);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayroll = async () => {
    if (!currentEmp) return;
    setLoading(true);
    try {
      const res = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: currentEmp.id,
          salaryMonth: selectedMonth,
          basicSalary: basicSalary.toFixed(2),
          overtimePay: overtimePay.toFixed(2),
          allowance: allowance.toFixed(2),
          deduction: absentDeduction.toFixed(2),
          advance: advance.toFixed(2),
          netSalary: netSalary.toFixed(2),
          workingDays,
          presentDays,
          leaveDays,
          absentDays,
          paymentStatus: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          transactionRef: `SMSF-PAY-${Date.now().toString().slice(-6)}`,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save salary');
      }

      setSavedSuccess(true);
      if (onSavedPayroll) onSavedPayroll();
    } catch (e: any) {
      alert(e.message || 'Error saving payroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Attendance + Salary Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated payroll computation based on muster rolls, working days, overtime hours, and statutory allowances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b pb-3 text-slate-900 font-bold text-sm">
            <Calculator className="w-4 h-4 text-blue-600" />
            Payroll Parameters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(Number(e.target.value));
                  setSavedSuccess(false);
                }}
                className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-600"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.employeeCode}) - ₹{Number(e.salary).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Salary Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSavedSuccess(false);
                }}
                className="w-full p-2 border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-blue-950 font-bold block">{currentEmp?.fullName}</span>
              <span className="text-blue-700">Basic Rate: ₹{basicSalary.toLocaleString('en-IN')}/mo</span>
            </div>
            <button
              onClick={handleCalculateFromDb}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
            >
              Sync DB Attendance
            </button>
          </div>

          {/* Days breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Total Days</label>
              <input
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-center"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-700 mb-1">Present Days</label>
              <input
                type="number"
                value={presentDays}
                onChange={(e) => setPresentDays(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-center font-bold text-emerald-700 bg-emerald-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-amber-700 mb-1">Leave Days</label>
              <input
                type="number"
                value={leaveDays}
                onChange={(e) => setLeaveDays(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-center"
              />
            </div>
            <div>
              <label className="block font-semibold text-rose-700 mb-1">Absent Days</label>
              <input
                type="number"
                value={absentDays}
                onChange={(e) => setAbsentDays(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-center font-bold text-rose-700 bg-rose-50/50"
              />
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Overtime Hours</label>
              <input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
              <span className="text-[10px] text-slate-400">@ 1.5x hourly rate</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Special Allowance (₹)</label>
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Travel / Night allowance</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Advance Taken (₹)</label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Prior disbursement</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cheque">Company Cheque</option>
                <option value="UPI">Direct UPI Transfer</option>
                <option value="Cash">Cash Voucher</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payroll Remarks</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Remarks for accounts"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payroll record saved successfully to the system!</span>
            </div>
          )}

          <button
            onClick={handleSavePayroll}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Receipt className="w-4 h-4" />
            {loading ? 'Processing...' : 'Save & Issue Net Salary to Payroll'}
          </button>
        </div>

        {/* Right: Printable / Visual Payslip */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-blue-200 shadow-sm flex items-center justify-center shrink-0">
                  <CompanyLogo size="sm" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Official Salary Voucher
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    Steel Man Force Security
                  </h3>
                  <p className="text-[11px] text-slate-500">Bommana Halli, Bengaluru - 560068</p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="Print Payslip"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Employee header */}
            <div className="py-4 border-b space-y-2 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Employee Name:</span>
                  <div className="font-bold text-slate-900">{currentEmp?.fullName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Employee Code:</span>
                  <div className="font-mono font-bold text-blue-700">{currentEmp?.employeeCode}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Designation:</span>
                  <div className="font-medium text-slate-800">{currentEmp?.designation}</div>
                </div>
                <div>
                  <span className="text-slate-400">Salary Month:</span>
                  <div className="font-bold text-slate-800">{selectedMonth}</div>
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Base Salary (30 Days)</span>
                <span className="font-semibold text-slate-900">₹{basicSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span>Overtime Pay ({overtimeHours} hrs @ 1.5x)</span>
                <span className="font-semibold">+₹{overtimePay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span>Special Duty Allowance</span>
                <span className="font-semibold">+₹{allowance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                <span>Absent Deduction ({absentDays} days)</span>
                <span className="font-semibold">-₹{absentDeduction.toFixed(2)}</span>
              </div>
              {advance > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                  <span>Advance Deducted</span>
                  <span className="font-semibold">-₹{advance.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Net Salary Total Box */}
          <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Disbursable Salary</span>
                <div className="text-3xl font-black text-emerald-400">
                  ₹{netSalary.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <span>Days Worked:</span>
                <div className="font-bold text-white text-sm">{presentDays} / {workingDays} Days</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
              <span>Mode: {paymentMethod}</span>
              <span>Authorized Signature: Operations Manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
