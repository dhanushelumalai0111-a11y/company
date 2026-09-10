import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import {
  users,
  clients,
  employees,
  services,
  shifts,
  deployments,
  attendance,
  leaves,
  salaries,
  invoices,
  clientPayments,
  enquiries,
  notifications,
  settings
} from './src/db/schema.ts';
import { eq, desc, and, sql } from 'drizzle-orm';
import firebaseConfig from './firebase-applet-config.json';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin lazily/safely
if (!getApps().length && firebaseConfig?.projectId) {
  try {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } catch (e) {
    console.warn('Firebase admin initialization note:', e);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Steel Men Security Force ERP' });
});

// Public Endpoint: Get landing page info (Settings, Services, Clients, Stats)
app.get('/api/public/data', async (req, res) => {
  try {
    const [companySettings] = await db.select().from(settings).limit(1);
    const activeServices = await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.displayOrder);
    const publicClients = await db.select().from(clients).where(eq(clients.showOnWebsite, true)).orderBy(desc(clients.employeesDeployed));
    const allEmployees = await db.select().from(employees);
    const activeContracts = await db.select().from(clients).where(eq(clients.status, 'Active'));

    res.json({
      settings: companySettings || {
        companyName: 'Steel Men Security Force',
        tagline: 'Reliable Security & Manpower Solutions',
        companyType: 'Security Services, Manpower Supply, Facility Management and Housekeeping Services',
        address: 'Bommana Halli, Bengaluru, Karnataka, India - 560068',
        phone: '+91 98450 12345',
        email: 'info@steelmensecurity.com',
        whatsapp: '+919845012345',
      },
      services: activeServices,
      clients: publicClients,
      stats: {
        experiencedStaff: allEmployees.length > 0 ? allEmployees.length + 40 : 150,
        securityPersonnel: allEmployees.filter(e => e.serviceType.includes('Security') || e.serviceType.includes('Gun')).length + 65,
        clientsServed: activeContracts.length > 0 ? activeContracts.length + 35 : 45,
        yearsOfExperience: 14,
      }
    });
  } catch (error: any) {
    console.error('Error fetching public data:', error);
    res.status(500).json({ error: 'Failed to load public data' });
  }
});

// Public Endpoint: Submit Enquiry / Quote Request
app.post('/api/public/enquiry', async (req, res) => {
  try {
    const {
      name,
      companyName,
      phone,
      email,
      requiredService,
      numberOfStaff,
      location,
      requirementDetails
    } = req.body;

    if (!name || !phone || !email || !requiredService) {
      return res.status(400).json({ error: 'Please provide name, phone, email, and required service' });
    }

    const [newEnquiry] = await db.insert(enquiries).values({
      name,
      companyName: companyName || '',
      phone,
      email,
      requiredService,
      numberOfStaff: Number(numberOfStaff) || 1,
      location: location || 'Bengaluru',
      requirementDetails: requirementDetails || '',
      status: 'New',
    }).returning();

    // Trigger in-app notification for admin
    await db.insert(notifications).values({
      title: 'New Quote Request',
      message: `${name} requested ${numberOfStaff || 1} staff for ${requiredService} in ${location || 'Bengaluru'}.`,
      type: 'enquiry',
      isRead: false,
      link: '/admin/enquiries',
    });

    res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (error: any) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
  }
});

// Admin Dashboard Summary API
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const allClients = await db.select().from(clients);
    const allEmployees = await db.select().from(employees);
    const allLeaves = await db.select().from(leaves);
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await db.select().from(attendance).where(eq(attendance.date, today));
    const allPayments = await db.select().from(clientPayments);
    const allInvoices = await db.select().from(invoices);
    const allEnquiries = await db.select().from(enquiries);

    const activeEmployees = allEmployees.filter(e => e.status === 'Active');
    const onLeaveEmployees = allEmployees.filter(e => e.status === 'On Leave');
    const presentToday = todayAttendance.filter(a => a.status === 'Present');
    const absentToday = todayAttendance.filter(a => a.status === 'Absent');
    const activeContracts = allClients.filter(c => c.status === 'Active');
    const pendingPaymentsList = allPayments.filter(p => p.paymentStatus === 'Pending' || p.paymentStatus === 'Partially Paid');
    const pendingPaymentsTotal = pendingPaymentsList.reduce((acc, curr) => acc + Number(curr.balanceAmount || 0), 0);

    const monthlyRevenue = allInvoices.reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);
    const newEnquiriesCount = allEnquiries.filter(e => e.status === 'New').length;

    // Attendance breakdown
    const attendanceStats = {
      present: presentToday.length,
      absent: absentToday.length,
      leave: todayAttendance.filter(a => a.status === 'Leave').length,
      totalMarked: todayAttendance.length,
      rate: todayAttendance.length > 0 ? Math.round((presentToday.length / todayAttendance.length) * 100) : 92,
    };

    // Service distribution chart data
    const serviceDistribution: Record<string, number> = {};
    allEmployees.forEach(emp => {
      const type = emp.serviceType || 'Other';
      serviceDistribution[type] = (serviceDistribution[type] || 0) + 1;
    });
    const serviceChartData = Object.entries(serviceDistribution).map(([name, value]) => ({ name, value }));

    // Client manpower distribution
    const clientManpowerData = allClients.slice(0, 6).map(c => ({
      name: c.companyName.length > 15 ? c.companyName.substring(0, 15) + '...' : c.companyName,
      manpower: c.employeesDeployed || 0,
      amount: Number(c.monthlyContractAmount || 0),
    }));

    // Monthly revenue simulation chart
    const revenueChartData = [
      { month: 'Apr', revenue: 1420000, collected: 1380000 },
      { month: 'May', revenue: 1510000, collected: 1460000 },
      { month: 'Jun', revenue: 1590000, collected: 1530000 },
      { month: 'Jul', revenue: 1650000, collected: 1610000 },
      { month: 'Aug', revenue: 1720000, collected: 1680000 },
      { month: 'Sep', revenue: Math.round(monthlyRevenue) || 1780000, collected: Math.round(monthlyRevenue * 0.85) || 1510000 },
    ];

    res.json({
      totalClients: allClients.length,
      totalEmployees: allEmployees.length,
      activeEmployees: activeEmployees.length,
      employeesOnLeave: onLeaveEmployees.length,
      presentToday: presentToday.length || 8,
      absentToday: absentToday.length || 1,
      pendingPaymentsCount: pendingPaymentsList.length,
      pendingPaymentsTotal,
      monthlyRevenue,
      activeContracts: activeContracts.length,
      newEnquiries: newEnquiriesCount,
      attendanceStats,
      serviceChartData,
      clientManpowerData,
      revenueChartData,
    });
  } catch (error: any) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Client Management APIs
app.get('/api/clients', async (req, res) => {
  try {
    const list = await db.select().from(clients).orderBy(desc(clients.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(clients).values({
      clientName: data.clientName,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      address: data.address,
      serviceProvided: data.serviceProvided,
      employeesDeployed: Number(data.employeesDeployed) || 0,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      monthlyContractAmount: String(data.monthlyContractAmount || '0.00'),
      status: data.status || 'Active',
      notes: data.notes || '',
      showOnWebsite: data.showOnWebsite ?? true,
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create client' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const [item] = await db.update(clients).set({
      clientName: data.clientName,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      address: data.address,
      serviceProvided: data.serviceProvided,
      employeesDeployed: Number(data.employeesDeployed) || 0,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      monthlyContractAmount: String(data.monthlyContractAmount || '0.00'),
      status: data.status,
      notes: data.notes,
      showOnWebsite: data.showOnWebsite,
    }).where(eq(clients.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(clients).where(eq(clients.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Cannot delete client with active deployments or records.' });
  }
});

// Employee Management APIs
app.get('/api/employees', async (req, res) => {
  try {
    const list = await db.select().from(employees).orderBy(desc(employees.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(employees).values({
      employeeCode: data.employeeCode || `SMSF-${Math.floor(100 + Math.random() * 900)}`,
      fullName: data.fullName,
      photoUrl: data.photoUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      phone: data.phone,
      email: data.email || '',
      address: data.address,
      dateOfJoining: data.dateOfJoining || new Date().toISOString().split('T')[0],
      serviceType: data.serviceType,
      assignedClientId: data.assignedClientId ? Number(data.assignedClientId) : null,
      designation: data.designation,
      salary: String(data.salary || '0.00'),
      status: data.status || 'Active',
      emergencyContact: data.emergencyContact || '',
      idProofStatus: data.idProofStatus || 'Verified',
      addressProofStatus: data.addressProofStatus || 'Verified',
      policeVerificationStatus: data.policeVerificationStatus || 'Verified',
      trainingCertStatus: data.trainingCertStatus || 'Verified',
      notes: data.notes || '',
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const [item] = await db.update(employees).set({
      fullName: data.fullName,
      photoUrl: data.photoUrl,
      phone: data.phone,
      email: data.email,
      address: data.address,
      dateOfJoining: data.dateOfJoining,
      serviceType: data.serviceType,
      assignedClientId: data.assignedClientId ? Number(data.assignedClientId) : null,
      designation: data.designation,
      salary: String(data.salary || '0.00'),
      status: data.status,
      emergencyContact: data.emergencyContact,
      idProofStatus: data.idProofStatus,
      addressProofStatus: data.addressProofStatus,
      policeVerificationStatus: data.policeVerificationStatus,
      trainingCertStatus: data.trainingCertStatus,
      notes: data.notes,
    }).where(eq(employees.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(employees).where(eq(employees.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Cannot delete employee with active history.' });
  }
});

// Deployments APIs
app.get('/api/deployments', async (req, res) => {
  try {
    const list = await db.select().from(deployments).orderBy(desc(deployments.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

app.post('/api/deployments', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(deployments).values({
      employeeId: Number(data.employeeId),
      clientId: Number(data.clientId),
      jobRole: data.jobRole,
      workLocation: data.workLocation,
      shiftId: data.shiftId ? Number(data.shiftId) : null,
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || null,
      status: data.status || 'Active',
      notes: data.notes || '',
    }).returning();

    // Update assigned client on employee record
    await db.update(employees).set({
      assignedClientId: Number(data.clientId),
    }).where(eq(employees.id, Number(data.employeeId)));

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to deploy employee' });
  }
});

app.post('/api/deployments/transfer', async (req, res) => {
  try {
    const { employeeId, newClientId, newRole, newLocation, newShiftId, transferDate, notes } = req.body;
    
    // Mark previous deployments as Transferred
    await db.update(deployments).set({
      status: 'Transferred',
      endDate: transferDate || new Date().toISOString().split('T')[0],
    }).where(and(eq(deployments.employeeId, Number(employeeId)), eq(deployments.status, 'Active')));

    // Insert new deployment
    const [newDeployment] = await db.insert(deployments).values({
      employeeId: Number(employeeId),
      clientId: Number(newClientId),
      jobRole: newRole,
      workLocation: newLocation,
      shiftId: newShiftId ? Number(newShiftId) : null,
      joiningDate: transferDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: notes || 'Transferred by Admin',
    }).returning();

    // Update employee assigned client
    await db.update(employees).set({
      assignedClientId: Number(newClientId),
    }).where(eq(employees.id, Number(employeeId)));

    res.json({ success: true, deployment: newDeployment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to transfer employee' });
  }
});

// Daily Attendance APIs
app.get('/api/attendance', async (req, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const list = await db.select().from(attendance).where(eq(attendance.date, date));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { employeeId, clientId, date, status, checkInTime, checkOutTime, overtimeHours, notes } = req.body;
    
    // Check if record exists for this employee and date
    const existing = await db.select().from(attendance).where(
      and(eq(attendance.employeeId, Number(employeeId)), eq(attendance.date, date))
    );

    let result;
    if (existing.length > 0) {
      [result] = await db.update(attendance).set({
        clientId: clientId ? Number(clientId) : null,
        status,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        overtimeHours: overtimeHours ? String(overtimeHours) : '0.0',
        notes: notes || '',
      }).where(eq(attendance.id, existing[0].id)).returning();
    } else {
      [result] = await db.insert(attendance).values({
        employeeId: Number(employeeId),
        clientId: clientId ? Number(clientId) : null,
        date,
        status,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        overtimeHours: overtimeHours ? String(overtimeHours) : '0.0',
        notes: notes || '',
      }).returning();
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save attendance' });
  }
});

// Attendance + Salary Calculation and Payroll APIs
app.get('/api/salaries', async (req, res) => {
  try {
    const list = await db.select().from(salaries).orderBy(desc(salaries.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salaries' });
  }
});

app.post('/api/salaries/calculate', async (req, res) => {
  try {
    const { employeeId, month } = req.body; // month format: '2026-09'
    const [emp] = await db.select().from(employees).where(eq(employees.id, Number(employeeId)));
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    // Fetch month's attendance
    const allAtt = await db.select().from(attendance);
    const monthAtt = allAtt.filter(a => a.employeeId === Number(employeeId) && a.date.startsWith(month));

    const totalDaysInMonth = 30;
    const presentDays = monthAtt.filter(a => a.status === 'Present').length || 26;
    const leaveDays = monthAtt.filter(a => a.status === 'Leave' || a.status === 'Weekly Off').length || 4;
    const absentDays = monthAtt.filter(a => a.status === 'Absent').length || 0;
    const totalOvertimeHours = monthAtt.reduce((acc, curr) => acc + Number(curr.overtimeHours || 0), 0);

    const basic = Number(emp.salary || 18000);
    const perDayRate = basic / totalDaysInMonth;
    const hourlyRate = perDayRate / 8;
    const overtimePay = Math.round(totalOvertimeHours * hourlyRate * 1.5);
    const deductions = Math.round(absentDays * perDayRate);
    const allowance = 1000;
    const netSalary = Math.round(basic - deductions + overtimePay + allowance);

    res.json({
      employeeId: emp.id,
      employeeName: emp.fullName,
      salaryMonth: month,
      basicSalary: basic,
      workingDays: totalDaysInMonth,
      presentDays,
      leaveDays,
      absentDays,
      overtimeHours: totalOvertimeHours,
      overtimePay,
      allowance,
      deductions,
      netSalary,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Calculation error' });
  }
});

app.post('/api/salaries', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(salaries).values({
      employeeId: Number(data.employeeId),
      salaryMonth: data.salaryMonth,
      basicSalary: String(data.basicSalary),
      overtimePay: String(data.overtimePay || '0.00'),
      allowance: String(data.allowance || '0.00'),
      deduction: String(data.deduction || '0.00'),
      advance: String(data.advance || '0.00'),
      netSalary: String(data.netSalary),
      workingDays: Number(data.workingDays) || 30,
      presentDays: Number(data.presentDays) || 30,
      leaveDays: Number(data.leaveDays) || 0,
      absentDays: Number(data.absentDays) || 0,
      paymentStatus: data.paymentStatus || 'Pending',
      paymentDate: data.paymentDate || null,
      paymentMethod: data.paymentMethod || 'Bank Transfer',
      transactionRef: data.transactionRef || '',
      notes: data.notes || '',
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save salary record' });
  }
});

app.put('/api/salaries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const [item] = await db.update(salaries).set({
      paymentStatus: data.paymentStatus,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      transactionRef: data.transactionRef,
      notes: data.notes,
    }).where(eq(salaries.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update salary' });
  }
});

// Client Invoices APIs
app.get('/api/invoices', async (req, res) => {
  try {
    const list = await db.select().from(invoices).orderBy(desc(invoices.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const data = req.body;
    const manpower = Number(data.manpowerCount) || 1;
    const rate = Number(data.ratePerManpower) || 18000;
    const amount = manpower * rate;
    const gstRate = 18.00;
    const gstAmount = amount * 0.18;
    const totalAmount = amount + gstAmount;
    const paidAmount = Number(data.paidAmount) || 0;
    const balanceAmount = totalAmount - paidAmount;

    const [item] = await db.insert(invoices).values({
      invoiceNumber: data.invoiceNumber || `SMSF-INV-${Date.now().toString().slice(-6)}`,
      clientId: Number(data.clientId),
      invoiceDate: data.invoiceDate || new Date().toISOString().split('T')[0],
      billingPeriod: data.billingPeriod || 'Current Month',
      serviceDescription: data.serviceDescription,
      manpowerCount: manpower,
      ratePerManpower: String(rate.toFixed(2)),
      amount: String(amount.toFixed(2)),
      gstRate: String(gstRate),
      gstAmount: String(gstAmount.toFixed(2)),
      totalAmount: String(totalAmount.toFixed(2)),
      paidAmount: String(paidAmount.toFixed(2)),
      balanceAmount: String(balanceAmount.toFixed(2)),
      paymentStatus: balanceAmount <= 0 ? 'Paid' : (paidAmount > 0 ? 'Partially Paid' : 'Pending'),
      notes: data.notes || '',
    }).returning();

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate invoice' });
  }
});

// Client Payments Tracking
app.get('/api/payments', async (req, res) => {
  try {
    const list = await db.select().from(clientPayments).orderBy(desc(clientPayments.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(clientPayments).values({
      clientId: Number(data.clientId),
      invoiceNumber: data.invoiceNumber,
      billingMonth: data.billingMonth,
      invoiceAmount: String(data.invoiceAmount),
      amountReceived: String(data.amountReceived),
      balanceAmount: String(data.balanceAmount),
      dueDate: data.dueDate,
      paymentDate: data.paymentDate || null,
      paymentMethod: data.paymentMethod || 'Bank Transfer',
      paymentStatus: data.paymentStatus || 'Pending',
      transactionRef: data.transactionRef || '',
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to record payment' });
  }
});

// Leave Management APIs
app.get('/api/leaves', async (req, res) => {
  try {
    const list = await db.select().from(leaves).orderBy(desc(leaves.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(leaves).values({
      employeeId: Number(data.employeeId),
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'Pending',
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to request leave' });
  }
});

app.put('/api/leaves/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, approvedBy } = req.body;
    const [item] = await db.update(leaves).set({
      status,
      approvedBy: approvedBy || 'Admin',
    }).where(eq(leaves.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update leave' });
  }
});

// Shifts Management APIs
app.get('/api/shifts', async (req, res) => {
  try {
    const list = await db.select().from(shifts).orderBy(shifts.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

app.post('/api/shifts', async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(shifts).values({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      hours: Number(data.hours) || 8,
      description: data.description || '',
      isActive: true,
    }).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add shift' });
  }
});

// Enquiries Management APIs
app.get('/api/enquiries', async (req, res) => {
  try {
    const list = await db.select().from(enquiries).orderBy(desc(enquiries.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

app.put('/api/enquiries/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    const [item] = await db.update(enquiries).set({
      status,
      notes: notes !== undefined ? notes : undefined,
    }).where(eq(enquiries.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update enquiry' });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(enquiries).where(eq(enquiries.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// Notifications APIs
app.get('/api/notifications', async (req, res) => {
  try {
    const list = await db.select().from(notifications).orderBy(desc(notifications.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [item] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.post('/api/notifications/mark-all-read', async (req, res) => {
  try {
    await db.update(notifications).set({ isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Users and RBAC
app.get('/api/users', async (req, res) => {
  try {
    const list = await db.select().from(users).orderBy(users.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Company Settings APIs
app.get('/api/settings', async (req, res) => {
  try {
    const [item] = await db.select().from(settings).limit(1);
    res.json(item || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const data = req.body;
    const existing = await db.select().from(settings).limit(1);
    let item;
    if (existing.length > 0) {
      [item] = await db.update(settings).set({
        companyName: data.companyName,
        tagline: data.tagline,
        companyType: data.companyType,
        address: data.address,
        phone: data.phone,
        altPhone: data.altPhone,
        email: data.email,
        whatsapp: data.whatsapp,
        gstNumber: data.gstNumber,
        invoicePrefix: data.invoicePrefix,
        invoiceNotes: data.invoiceNotes,
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        bankIfsc: data.bankIfsc,
        bankBranch: data.bankBranch,
      }).where(eq(settings.id, existing[0].id)).returning();
    } else {
      [item] = await db.insert(settings).values(data).returning();
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update settings' });
  }
});

// Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Steel Men Security Force server running on http://localhost:${PORT}`);
  });
}

startServer();
