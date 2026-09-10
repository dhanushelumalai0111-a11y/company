import React from 'react';
import {
  Users,
  Building2,
  CalendarCheck,
  CalendarX,
  CreditCard,
  IndianRupee,
  ShieldCheck,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardOverviewProps {
  summary: any;
  onNavigate: (module: string) => void;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  onNavigate,
}) => {
  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Loading Command Dashboard...
      </div>
    );
  }

  const attendancePieData = [
    { name: 'Present', value: summary.attendanceStats?.present || 8, color: '#10b981' },
    { name: 'Absent', value: summary.attendanceStats?.absent || 1, color: '#ef4444' },
    { name: 'Leave', value: summary.attendanceStats?.leave || 1, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Operational Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of security personnel, facility deployments, attendance and revenue across Bengaluru.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
          <button
            onClick={() => onNavigate('clients')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            Add Client
          </button>
          <button
            onClick={() => onNavigate('employees')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            Add Staff
          </button>
          <button
            onClick={() => onNavigate('invoices')}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* 8 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div
          onClick={() => onNavigate('clients')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Clients
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{summary.totalClients}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {summary.activeContracts} Active Contracts
          </div>
        </div>

        {/* Total Employees */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Staff
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{summary.totalEmployees}</div>
          <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {summary.activeEmployees} Active on Roster
          </div>
        </div>

        {/* Attendance Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Present Today
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{summary.presentToday}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Absent: <strong className="text-rose-600">{summary.absentToday}</strong></span>
            <span>Attendance: <strong className="text-emerald-600">{summary.attendanceStats?.rate || 92}%</strong></span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{Number(summary.pendingPaymentsTotal || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {summary.pendingPaymentsCount} Invoices Pending
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Quick Stats (Staff on Leave, Monthly Invoicing, Leads) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('leaves')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50"
        >
          <div>
            <div className="text-xs font-bold text-slate-500">Staff On Leave</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {summary.employeesOnLeave}
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">Manage Leave Requests →</div>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <CalendarX className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('invoices')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50"
        >
          <div>
            <div className="text-xs font-bold text-slate-500">Total Billed Revenue</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{Number(summary.monthlyRevenue || 1780000).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">View All Invoices →</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('enquiries')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50"
        >
          <div>
            <div className="text-xs font-bold text-slate-500">New Client Enquiries</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {summary.newEnquiries}
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">Review Lead Submissions →</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
            <Inbox className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue & Collections Bar Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Billing & Collections Trend</h3>
              <p className="text-xs text-slate-500">Monthly contract value vs collected funds (INR)</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md">
              FY 2026-27
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.revenueChartData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Billed Amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Attendance Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Today's Attendance Ratio</h3>
            <p className="text-xs text-slate-500">Real-time morning & evening muster roll</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
            <div>
              <div className="font-bold text-emerald-600 text-base">{summary.presentToday}</div>
              <div className="text-[11px] text-slate-500">Present</div>
            </div>
            <div>
              <div className="font-bold text-rose-600 text-base">{summary.absentToday}</div>
              <div className="text-[11px] text-slate-500">Absent</div>
            </div>
            <div>
              <div className="font-bold text-amber-600 text-base">{summary.employeesOnLeave}</div>
              <div className="text-[11px] text-slate-500">On Leave</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Client Manpower Deployment Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Key Client Manpower Deployments</h3>
            <p className="text-xs text-slate-500">Top active contracts with personnel count and monthly billing</p>
          </div>
          <button
            onClick={() => onNavigate('clients')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All Clients →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(summary.clientManpowerData || []).map((client: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{client.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  {client.manpower} Guards
                </span>
              </div>
              <div className="text-xs text-slate-600 flex justify-between">
                <span>Monthly Contract:</span>
                <span className="font-bold text-slate-800">₹{Number(client.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
