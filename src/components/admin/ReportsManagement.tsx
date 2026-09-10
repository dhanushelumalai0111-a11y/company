import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  Building,
  Receipt,
  Download,
  Printer,
  Shield,
  CheckCircle
} from 'lucide-react';
import { ClientItem, EmployeeItem, InvoiceItem, SalaryRecord } from '../../types.ts';

interface ReportsManagementProps {
  clients: ClientItem[];
  employees: EmployeeItem[];
  invoices: InvoiceItem[];
  salaries: SalaryRecord[];
}

export const ReportsManagement: React.FC<ReportsManagementProps> = ({
  clients = [],
  employees = [],
  invoices = [],
  salaries = [],
}) => {
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  const safeSalaries = Array.isArray(salaries) ? salaries : [];

  // Aggregate Metrics
  const totalBilled = safeInvoices.reduce((sum, inv) => sum + Number(inv?.totalAmount || 0), 0);
  const totalCollected = safeInvoices.reduce((sum, inv) => sum + Number(inv?.paidAmount || 0), 0);
  const totalOutstanding = totalBilled - totalCollected;

  const totalPayroll = safeSalaries.reduce((sum, s) => sum + Number(s?.netSalary || 0), 0);

  // Group by service
  const serviceDistribution: Record<string, number> = {};
  safeEmployees.forEach((emp) => {
    if (emp?.serviceType) {
      serviceDistribution[emp.serviceType] = (serviceDistribution[emp.serviceType] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Intelligence & Executive Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational manpower statistics, revenue versus payroll cash flow, and client contract performance.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Comprehensive Report
        </button>
      </div>

      {/* High-level summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Billed (Invoices)</span>
          <div className="text-2xl font-black text-slate-900">₹{totalBilled.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 18% GST Compliance Applied
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collections Received</span>
          <div className="text-2xl font-black text-emerald-700">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500">
            Outstanding: ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guard Payroll Disbursed</span>
          <div className="text-2xl font-black text-blue-700">₹{totalPayroll.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500">
            {safeSalaries.length} Staff Monthly Cycles Processed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Personnel</span>
          <div className="text-2xl font-black text-slate-900">{safeEmployees.filter(e => e && e.status === 'Active').length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Across {safeClients.filter(c => c && c.status === 'Active').length} Contract Sites
          </div>
        </div>
      </div>

      {/* Service Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Manpower Roster by Specialization
          </h3>

          <div className="space-y-3">
            {Object.entries(serviceDistribution).map(([service, count]) => {
              const pct = Math.round((count / (safeEmployees.length || 1)) * 100);
              return (
                <div key={service} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{service}</span>
                    <span>{count} Staff ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Billing Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Top Client Deployments & Monthly Value
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {clients.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{c.companyName}</div>
                  <div className="text-[11px] text-slate-500">{c.serviceProvided} • {c.employeesDeployed} Guards</div>
                </div>
                <div className="text-right font-black text-slate-900">
                  ₹{Number(c.monthlyContractAmount || 0).toLocaleString('en-IN')}/mo
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
