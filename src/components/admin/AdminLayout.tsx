import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  CalendarCheck,
  Clock,
  Banknote,
  Calculator,
  ReceiptText,
  CreditCard,
  FileCheck2,
  CalendarX,
  Inbox,
  BarChart3,
  Bell,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { NotificationItem } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface AdminLayoutProps {
  currentModule?: string;
  activeTab?: string;
  onSelectModule?: (module: string) => void;
  onTabChange?: (module: string) => void;
  onExitAdmin?: () => void;
  onBackToPublic?: () => void;
  onLogout?: () => void;
  settings?: any;
  enquiryCount?: number;
  pendingLeaveCount?: number;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: number) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentModule,
  activeTab,
  onSelectModule,
  onTabChange,
  onExitAdmin,
  onBackToPublic,
  onLogout,
  settings,
  enquiryCount,
  pendingLeaveCount,
  notifications = [],
  onMarkNotificationRead = (_id: number) => {},
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'super_admin' | 'hr' | 'accountant' | 'supervisor'>('super_admin');

  const effectiveModule = activeTab || currentModule || 'overview';
  const handleSelectModule = (mod: string) => {
    if (onTabChange) onTabChange(mod);
    else if (onSelectModule) onSelectModule(mod);
  };
  const handleExit = onBackToPublic || onExitAdmin || onLogout || (() => {});

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => !n.isRead).length;

  const navigationGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Operations & Staff',
      items: [
        { id: 'clients', label: 'Client Management', icon: Building2 },
        { id: 'employees', label: 'Employee Directory', icon: Users },
        { id: 'deployments', label: 'Staff Deployments', icon: MapPin },
        { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
        { id: 'shifts', label: 'Shift Rosters', icon: Clock },
        { id: 'documents', label: 'Document & Police Verification', icon: FileCheck2 },
      ],
    },
    {
      group: 'Finance & Invoicing',
      items: [
        { id: 'salaries', label: 'Salary & Payroll', icon: Banknote },
        { id: 'calculator', label: 'Attendance + Salary Calculator', icon: Calculator },
        { id: 'invoices', label: 'Client Invoices & GST', icon: ReceiptText },
        { id: 'payments', label: 'Client Payment Tracking', icon: CreditCard },
      ],
    },
    {
      group: 'HR & Administration',
      items: [
        { id: 'leaves', label: 'Leave Requests', icon: CalendarX },
        { id: 'enquiries', label: 'Leads & Enquiries', icon: Inbox },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'users', label: 'User Roles & Access', icon: UserCog },
        { id: 'settings', label: 'Company Settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-sm border-b border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow flex items-center justify-center border border-blue-500/30">
                <CompanyLogo size="xs" />
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-sm tracking-tight text-white leading-tight">
                  STEEL MAN FORCE SECURITY
                </div>
                <div className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">
                  Central Command & ERP Portal
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Demo Role Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as any)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="super_admin" className="bg-slate-800 text-white">Super Admin</option>
                <option value="hr" className="bg-slate-800 text-white">HR Manager</option>
                <option value="accountant" className="bg-slate-800 text-white">Accounts Officer</option>
                <option value="supervisor" className="bg-slate-800 text-white">Field Supervisor</option>
              </select>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                id="btn-admin-notifications"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider">System Alerts</span>
                    <span className="text-[11px] bg-blue-600 px-2 py-0.5 rounded-full text-white">
                      {unreadCount} New
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {safeNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                    ) : (
                      safeNotifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (onMarkNotificationRead) onMarkNotificationRead(n.id);
                            if (n.link) {
                              const mod = n.link.replace('/admin/', '');
                              handleSelectModule(mod);
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-blue-50/60 font-semibold' : ''
                          }`}
                        >
                          <div className="font-bold text-slate-900">{n.title}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Public Website */}
            <button
              onClick={handleExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main Content Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 pt-16 lg:pt-0 border-r border-slate-800 flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navigationGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = effectiveModule === item.id || (item.id === 'dashboard' && effectiveModule === 'overview');
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-link-${item.id}`}
                      onClick={() => {
                        handleSelectModule(item.id === 'dashboard' ? 'overview' : item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.id === 'enquiries' && typeof enquiryCount === 'number' && enquiryCount > 0 && (
                        <span className="ml-auto bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                          {enquiryCount}
                        </span>
                      )}
                      {item.id === 'leaves' && typeof pendingLeaveCount === 'number' && pendingLeaveCount > 0 && (
                        <span className="ml-auto bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                          {pendingLeaveCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User profile footer in sidebar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs">
                SM
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-white truncate">Administrator</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                  {currentRole.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 z-10 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
