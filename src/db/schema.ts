import { pgTable, serial, text, integer, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for Admin Login & RBAC
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or local admin ID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'), // super_admin, admin, hr, accountant, supervisor
  phone: text('phone'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Clients Table
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  companyName: text('company_name').notNull(),
  contactPerson: text('contact_person').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  serviceProvided: text('service_provided').notNull(),
  employeesDeployed: integer('employees_deployed').default(0),
  contractStartDate: text('contract_start_date').notNull(),
  contractEndDate: text('contract_end_date').notNull(),
  monthlyContractAmount: numeric('monthly_contract_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  status: text('status').notNull().default('Active'), // Active, Inactive
  notes: text('notes'),
  showOnWebsite: boolean('show_on_website').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Employees Table
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  employeeCode: text('employee_code').notNull().unique(),
  fullName: text('full_name').notNull(),
  photoUrl: text('photo_url'),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  dateOfJoining: text('date_of_joining').notNull(),
  serviceType: text('service_type').notNull(), // Security Guard, Gun Man, Housekeeper, Driver, Office Boy, Swimming Pool Operator, etc.
  assignedClientId: integer('assigned_client_id').references(() => clients.id),
  designation: text('designation').notNull(),
  salary: numeric('salary', { precision: 10, scale: 2 }).notNull().default('0.00'),
  status: text('status').notNull().default('Active'), // Active, Inactive, On Leave
  emergencyContact: text('emergency_contact'),
  idProofStatus: text('id_proof_status').default('Verified'), // Verified, Pending, Missing
  addressProofStatus: text('address_proof_status').default('Verified'),
  policeVerificationStatus: text('police_verification_status').default('Verified'),
  trainingCertStatus: text('training_cert_status').default('Verified'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Services Catalog
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDesc: text('short_desc').notNull(),
  description: text('description').notNull(),
  benefits: text('benefits').notNull(), // Stored as comma-separated or JSON string
  iconName: text('icon_name').notNull(),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').default(true),
});

// Shifts Management
export const shifts = pgTable('shifts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Day Shift, Night Shift, General Shift, Custom Shift
  startTime: text('start_time').notNull(), // e.g., '08:00 AM'
  endTime: text('end_time').notNull(), // e.g., '08:00 PM'
  hours: integer('hours').default(12),
  description: text('description'),
  isActive: boolean('is_active').default(true),
});

// Deployments Table
export const deployments = pgTable('deployments', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  jobRole: text('job_role').notNull(),
  workLocation: text('work_location').notNull(),
  shiftId: integer('shift_id').references(() => shifts.id),
  joiningDate: text('joining_date').notNull(),
  endDate: text('end_date'),
  status: text('status').notNull().default('Active'), // Active, Transferred, Completed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Daily Attendance Records
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  clientId: integer('client_id').references(() => clients.id),
  date: text('date').notNull(), // YYYY-MM-DD
  status: text('status').notNull(), // Present, Absent, Leave, Half Day, Weekly Off, Holiday
  checkInTime: text('check_in_time'),
  checkOutTime: text('check_out_time'),
  overtimeHours: numeric('overtime_hours', { precision: 4, scale: 1 }).default('0.0'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leave Management
export const leaves = pgTable('leaves', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  leaveType: text('leave_type').notNull(), // Sick, Casual, Paid, Emergency
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('Pending'), // Pending, Approved, Rejected
  approvedBy: text('approved_by'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Employee Salaries / Payroll
export const salaries = pgTable('salaries', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  salaryMonth: text('salary_month').notNull(), // e.g., '2026-08'
  basicSalary: numeric('basic_salary', { precision: 10, scale: 2 }).notNull(),
  overtimePay: numeric('overtime_pay', { precision: 10, scale: 2 }).default('0.00'),
  allowance: numeric('allowance', { precision: 10, scale: 2 }).default('0.00'),
  deduction: numeric('deduction', { precision: 10, scale: 2 }).default('0.00'),
  advance: numeric('advance', { precision: 10, scale: 2 }).default('0.00'),
  netSalary: numeric('net_salary', { precision: 10, scale: 2 }).notNull(),
  workingDays: integer('working_days').default(30),
  presentDays: integer('present_days').default(30),
  leaveDays: integer('leave_days').default(0),
  absentDays: integer('absent_days').default(0),
  paymentStatus: text('payment_status').notNull().default('Pending'), // Paid, Pending
  paymentDate: text('payment_date'),
  paymentMethod: text('payment_method'), // Cash, Bank Transfer, UPI, Cheque, Other
  transactionRef: text('transaction_ref'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Invoices
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  invoiceDate: text('invoice_date').notNull(),
  billingPeriod: text('billing_period').notNull(),
  serviceDescription: text('service_description').notNull(),
  manpowerCount: integer('manpower_count').notNull(),
  ratePerManpower: numeric('rate_per_manpower', { precision: 10, scale: 2 }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  gstRate: numeric('gst_rate', { precision: 5, scale: 2 }).default('18.00'),
  gstAmount: numeric('gst_amount', { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  paidAmount: numeric('paid_amount', { precision: 12, scale: 2 }).default('0.00'),
  balanceAmount: numeric('balance_amount', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: text('payment_status').notNull().default('Pending'), // Paid, Partially Paid, Pending, Overdue
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Payments
export const clientPayments = pgTable('client_payments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  invoiceNumber: text('invoice_number').notNull(),
  billingMonth: text('billing_month').notNull(),
  invoiceAmount: numeric('invoice_amount', { precision: 12, scale: 2 }).notNull(),
  amountReceived: numeric('amount_received', { precision: 12, scale: 2 }).notNull(),
  balanceAmount: numeric('balance_amount', { precision: 12, scale: 2 }).notNull(),
  dueDate: text('due_date').notNull(),
  paymentDate: text('payment_date'),
  paymentMethod: text('payment_method'), // Bank Transfer, UPI, Cheque, Cash, Other
  paymentStatus: text('payment_status').notNull().default('Pending'), // Paid, Partially Paid, Pending, Overdue
  transactionRef: text('transaction_ref'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customer Enquiries / Quotes
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  companyName: text('company_name'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  requiredService: text('required_service').notNull(),
  numberOfStaff: integer('number_of_staff').notNull().default(1),
  location: text('location').notNull(),
  requirementDetails: text('requirement_details').notNull(),
  status: text('status').notNull().default('New'), // New, Contacted, Quotation Sent, Converted, Rejected
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// System Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // payment, salary, attendance, contract, document, enquiry, info
  isRead: boolean('is_read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Company Settings
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull().default('Steel Men Security Force'),
  tagline: text('tagline').notNull().default('Reliable Security & Manpower Solutions'),
  companyType: text('company_type').notNull().default('Security Services, Manpower Supply, Facility Management and Housekeeping Services'),
  address: text('address').notNull().default('Bommana Halli, Bengaluru, Karnataka, India - 560068'),
  phone: text('phone').notNull().default('+91 98450 12345'),
  altPhone: text('alt_phone').default('+91 80 2573 8901'),
  email: text('email').notNull().default('info@steelmensecurity.com'),
  whatsapp: text('whatsapp').notNull().default('+919845012345'),
  gstNumber: text('gst_number').default('29AABCS1429B1Z8'),
  invoicePrefix: text('invoice_prefix').default('SMSF-INV-'),
  invoiceNotes: text('invoice_notes').default('Thank you for partnering with Steel Men Security Force. Payment is due within 15 days of invoice date.'),
  bankName: text('bank_name').default('HDFC Bank'),
  bankAccount: text('bank_account').default('50200084729104'),
  bankIfsc: text('bank_ifsc').default('HDFC0001234'),
  bankBranch: text('bank_branch').default('Bommanahalli Branch, Bengaluru'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  employees: many(employees),
  deployments: many(deployments),
  invoices: many(invoices),
  payments: many(clientPayments),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  assignedClient: one(clients, {
    fields: [employees.assignedClientId],
    references: [clients.id],
  }),
  deployments: many(deployments),
  attendance: many(attendance),
  leaves: many(leaves),
  salaries: many(salaries),
}));

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  employee: one(employees, {
    fields: [deployments.employeeId],
    references: [employees.id],
  }),
  client: one(clients, {
    fields: [deployments.clientId],
    references: [clients.id],
  }),
  shift: one(shifts, {
    fields: [deployments.shiftId],
    references: [shifts.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
  client: one(clients, {
    fields: [attendance.clientId],
    references: [clients.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
}));

export const clientPaymentsRelations = relations(clientPayments, ({ one }) => ({
  client: one(clients, {
    fields: [clientPayments.clientId],
    references: [clients.id],
  }),
}));
