import React, { useState, useEffect } from 'react';
import {
  Shield,
  Phone,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';

// Public Components
import { Navbar } from './components/public/Navbar.tsx';
import { Hero } from './components/public/Hero.tsx';
import { ServicesSection } from './components/public/ServicesSection.tsx';
import { AboutSection } from './components/public/AboutSection.tsx';
import { ClientsShowcase } from './components/public/ClientsShowcase.tsx';
import { WhyChooseUs } from './components/public/WhyChooseUs.tsx';
import { TestimonialsSection } from './components/public/TestimonialsSection.tsx';
import { ContactSection } from './components/public/ContactSection.tsx';
import { EnquiryModal } from './components/public/EnquiryModal.tsx';
import { CompanyLogo } from './components/common/CompanyLogo.tsx';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { DashboardOverview } from './components/admin/DashboardOverview.tsx';
import { ClientManagement } from './components/admin/ClientManagement.tsx';
import { EmployeeManagement } from './components/admin/EmployeeManagement.tsx';
import { DeploymentManagement } from './components/admin/DeploymentManagement.tsx';
import { AttendanceManagement } from './components/admin/AttendanceManagement.tsx';
import { SalaryManagement } from './components/admin/SalaryManagement.tsx';
import { SalaryCalculator } from './components/admin/SalaryCalculator.tsx';
import { InvoiceManagement } from './components/admin/InvoiceManagement.tsx';
import { EnquiryManagement } from './components/admin/EnquiryManagement.tsx';
import { LeaveShiftManagement } from './components/admin/LeaveShiftManagement.tsx';
import { DocumentManagement } from './components/admin/DocumentManagement.tsx';
import { ReportsManagement } from './components/admin/ReportsManagement.tsx';
import { SettingsManagement } from './components/admin/SettingsManagement.tsx';
import { DEFAULT_SERVICES } from './data/defaultServices.ts';

import {
  ClientItem,
  EmployeeItem,
  DeploymentItem,
  AttendanceRecord,
  SalaryRecord,
  InvoiceItem,
  EnquiryItem,
  LeaveRequest,
  ShiftItem,
  DocumentItem,
  CompanySettings,
  ServiceItem
} from './types.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState<boolean>(false);
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState<string | undefined>(undefined);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('admin@steelmensecurityforce.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Application Data State
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: 'Steel Men Security Force',
    tagline: 'Premier Security, Guarding & Facility Management Services',
    phone: '+91 98450 12345',
    email: 'info@steelmensecurityforce.com',
    emergencyPhone: '+91 98450 99999',
    address: 'Near Oxford College, Bommana Halli, Hosur Main Road, Bengaluru, Karnataka, India - 560068',
    psaraLicenseNo: 'KA/BLR/PSARA/2021/4982',
    gstNumber: '29AABCS8891P1ZX',
    panNumber: 'AABCS8891P',
    bankName: 'State Bank of India',
    bankAccount: '39088472910',
    bankIfsc: 'SBIN0004512',
    bankBranch: 'Bommanahalli, Bengaluru',
    enableGst: true,
    defaultGstRate: '18.00',
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Load all data
  const loadData = async () => {
    try {
      const [
        pubRes,
        clientsRes,
        employeesRes,
        deploymentsRes,
        salariesRes,
        invoicesRes,
        enquiriesRes,
        leavesRes,
        shiftsRes,
        documentsRes,
        settingsRes,
      ] = await Promise.all([
        fetch('/api/public/data').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/clients').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/employees').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/deployments').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/salaries').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/invoices').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/enquiries').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/leaves').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/shifts').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/documents').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (pubRes?.services && Array.isArray(pubRes.services) && pubRes.services.length > 0) {
        setServices(pubRes.services);
      }
      if (pubRes?.settings && !settingsRes) {
        setSettings(pubRes.settings);
      }

      setClients(Array.isArray(clientsRes) ? clientsRes : []);
      setEmployees(Array.isArray(employeesRes) ? employeesRes : []);
      setDeployments(Array.isArray(deploymentsRes) ? deploymentsRes : []);
      setSalaries(Array.isArray(salariesRes) ? salariesRes : []);
      setInvoices(Array.isArray(invoicesRes) ? invoicesRes : []);
      setEnquiries(Array.isArray(enquiriesRes) ? enquiriesRes : []);
      setLeaves(Array.isArray(leavesRes) ? leavesRes : []);
      setShifts(Array.isArray(shiftsRes) ? shiftsRes : []);
      setDocuments(Array.isArray(documentsRes) ? documentsRes : []);
      if (settingsRes) setSettings(settingsRes);

      // fetch today attendance
      const todayStr = new Date().toISOString().split('T')[0];
      const attRes = await fetch(`/api/attendance?date=${todayStr}`);
      if (attRes.ok) {
        const attData = await attRes.json();
        setTodayAttendance(attData);
      }
    } catch (err) {
      console.error('Error fetching application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEnquiry = (serviceTitle?: string) => {
    setSelectedServiceForEnquiry(serviceTitle);
    setEnquiryModalOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized session demo login
    setCurrentUser({
      name: 'Admin Commander',
      role: 'Super Admin',
      email: loginEmail,
    });
    setLoginModalOpen(false);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('public');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* View Switcher: Public Website vs Admin Management Dashboard */}
      {currentView === 'public' ? (
        <div className="flex flex-col min-h-screen">
          {/* Top Quick Bar */}
          <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 border-b border-slate-900">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Bommana Halli, Bengaluru, Karnataka
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PSARA Certified & Police Verified
                </span>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={`tel:${settings.emergencyPhone || '+919845099999'}`}
                  className="flex items-center gap-1 text-amber-400 font-bold hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  24/7 Control Room: {settings.emergencyPhone || '+91 98450 99999'}
                </a>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setCurrentView('admin');
                    } else {
                      setLoginModalOpen(true);
                    }
                  }}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  Admin & Client Portal
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <Navbar
            settings={settings}
            onOpenEnquiryModal={() => handleOpenEnquiry()}
            onOpenAdmin={() => {
              if (currentUser) {
                setCurrentView('admin');
              } else {
                setLoginModalOpen(true);
              }
            }}
          />

          {/* Main Website Sections */}
          <main className="flex-1">
            <Hero
              settings={settings}
              onOpenEnquiryModal={() => handleOpenEnquiry()}
            />
            <ServicesSection
              services={services}
              onSelectService={handleOpenEnquiry}
              onEnquireNow={handleOpenEnquiry}
            />
            <AboutSection
              settings={settings}
              onOpenEnquiryModal={() => handleOpenEnquiry()}
            />
            <ClientsShowcase clients={clients} />
            <WhyChooseUs onOpenEnquiryModal={() => handleOpenEnquiry()} />
            <TestimonialsSection />
            <ContactSection settings={settings} onRefresh={loadData} />
          </main>

          {/* Footer */}
          <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Col 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-blue-500/30">
                      <CompanyLogo size="sm" />
                    </div>
                    <div>
                      <span className="block text-lg font-black text-white tracking-tight leading-tight">
                        STEEL MAN
                      </span>
                      <span className="block text-[11px] uppercase tracking-widest text-blue-400 font-extrabold">
                        Force Security
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reliable armed & unarmed security guarding, facility upkeep, swimming pool management, and specialized corporate manpower services headquartered in Bommanahalli, Bengaluru.
                  </p>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>PSARA Lic: <span className="text-slate-200 font-mono">{settings.psaraLicenseNo}</span></div>
                    <div>GSTIN: <span className="text-slate-200 font-mono">{settings.gstNumber}</span></div>
                  </div>
                </div>

                {/* Col 2 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                    Security Solutions
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li><a href="#services" className="hover:text-white">Security Guard Services</a></li>
                    <li><a href="#services" className="hover:text-white">Gun Men / Armed Security</a></li>
                    <li><a href="#services" className="hover:text-white">House Keeping Services</a></li>
                    <li><a href="#services" className="hover:text-white">Corporate Driver Services</a></li>
                    <li><a href="#services" className="hover:text-white">Swimming Pool Operator</a></li>
                    <li><a href="#services" className="hover:text-white">Facility Management</a></li>
                  </ul>
                </div>

                {/* Col 3 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                    Quick Links
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li><a href="#about" className="hover:text-white">About Our Force</a></li>
                    <li><a href="#why-us" className="hover:text-white">PSARA Compliance & Vetting</a></li>
                    <li><a href="#clients" className="hover:text-white">Client Portfolio</a></li>
                    <li><a href="#contact" className="hover:text-white">Contact & Site Visit</a></li>
                    <li>
                      <button
                        onClick={() => {
                          if (currentUser) setCurrentView('admin');
                          else setLoginModalOpen(true);
                        }}
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Management Dashboard
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 4 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                    Headquarters
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {settings.address}
                  </p>
                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>{settings.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>{settings.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} Steel Men Security Force. All Rights Reserved. Bommana Halli, Bengaluru.</p>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>PSARA Compliant</span>
                  <span>•</span>
                  <span>ISO 9001:2015</span>
                  <span>•</span>
                  <span>ESI & PF Registered</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* Admin Management Dashboard View */
        <AdminLayout
          activeTab={activeAdminTab}
          currentModule={activeAdminTab}
          onTabChange={setActiveAdminTab}
          onSelectModule={setActiveAdminTab}
          settings={settings}
          enquiryCount={(Array.isArray(enquiries) ? enquiries : []).filter((e) => e && e.status === 'New').length}
          pendingLeaveCount={(Array.isArray(leaves) ? leaves : []).filter((l) => l && l.status === 'Pending').length}
          onBackToPublic={() => setCurrentView('public')}
          onExitAdmin={() => setCurrentView('public')}
          onLogout={handleLogout}
        >
          {/* Tab Subviews */}
          {activeAdminTab === 'overview' && (
            <DashboardOverview
              clients={clients}
              employees={employees}
              deployments={deployments}
              todayAttendance={todayAttendance}
              invoices={invoices}
              enquiries={enquiries}
              salaries={salaries}
              onNavigateTab={setActiveAdminTab}
            />
          )}

          {activeAdminTab === 'clients' && (
            <ClientManagement
              clients={clients}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'employees' && (
            <EmployeeManagement
              employees={employees}
              clients={clients}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'deployments' && (
            <DeploymentManagement
              deployments={deployments}
              employees={employees}
              clients={clients}
              shifts={shifts}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'attendance' && (
            <AttendanceManagement
              employees={employees}
              clients={clients}
              onRefreshDashboard={loadData}
            />
          )}

          {activeAdminTab === 'salaries' && (
            <SalaryManagement
              salaries={salaries}
              employees={employees}
              onRefresh={loadData}
              onOpenCalculator={() => setActiveAdminTab('calculator')}
            />
          )}

          {activeAdminTab === 'calculator' && (
            <SalaryCalculator
              employees={employees}
              settings={settings}
              onSavedPayroll={() => {
                loadData();
                setActiveAdminTab('salaries');
              }}
            />
          )}

          {activeAdminTab === 'invoices' && (
            <InvoiceManagement
              invoices={invoices}
              clients={clients}
              settings={settings}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'enquiries' && (
            <EnquiryManagement
              enquiries={enquiries}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'leaves-shifts' && (
            <LeaveShiftManagement
              leaves={leaves}
              shifts={shifts}
              employees={employees}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'documents' && (
            <DocumentManagement
              documents={documents}
              employees={employees}
              clients={clients}
              onRefresh={loadData}
            />
          )}

          {activeAdminTab === 'reports' && (
            <ReportsManagement
              clients={clients}
              employees={employees}
              invoices={invoices}
              salaries={salaries}
            />
          )}

          {activeAdminTab === 'settings' && (
            <SettingsManagement
              settings={settings}
              onRefresh={loadData}
            />
          )}
        </AdminLayout>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        initialService={selectedServiceForEnquiry}
        preSelectedService={selectedServiceForEnquiry}
        services={services}
        settings={settings}
        onSuccess={loadData}
      />

      {/* Admin Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-14 h-14 rounded-xl bg-slate-50 p-1 shadow-md flex items-center justify-center border border-blue-200">
                <CompanyLogo size="md" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                  Staff & Admin Portal
                </h3>
                <p className="text-xs text-blue-700 font-semibold">
                  Steel Man Force Security ERP
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs mb-5 border border-blue-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Demo access pre-filled. Click <strong>Access Dashboard</strong> below to view all ERP management modules.
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Commander / Official Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Access Key / Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4" />
                Access Management Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
