export interface CompanySettings {
  id: number;
  companyName: string;
  tagline: string;
  companyType: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  whatsapp: string;
  gstNumber?: string;
  invoicePrefix?: string;
  invoiceNotes?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankBranch?: string;
  emergencyPhone?: string;
  psaraLicenseNo?: string;
  panNumber?: string;
  enableGst?: boolean;
  defaultGstRate?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  benefits: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ClientItem {
  id: number;
  clientName: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  serviceProvided: string;
  employeesDeployed: number;
  contractStartDate: string;
  contractEndDate: string;
  monthlyContractAmount: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  showOnWebsite?: boolean;
}

export interface EmployeeItem {
  id: number;
  employeeCode: string;
  fullName: string;
  photoUrl?: string;
  phone: string;
  email?: string;
  address: string;
  dateOfJoining: string;
  serviceType: string;
  assignedClientId?: number | null;
  designation: string;
  salary: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  emergencyContact?: string;
  idProofStatus?: 'Verified' | 'Pending' | 'Missing';
  addressProofStatus?: 'Verified' | 'Pending' | 'Missing';
  policeVerificationStatus?: 'Verified' | 'Pending' | 'Missing';
  trainingCertStatus?: 'Verified' | 'Pending' | 'Missing';
  notes?: string;
}

export interface DeploymentItem {
  id: number;
  employeeId: number;
  clientId: number;
  jobRole: string;
  workLocation: string;
  shiftId?: number;
  joiningDate: string;
  endDate?: string | null;
  status: 'Active' | 'Transferred' | 'Completed';
  notes?: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  clientId?: number | null;
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Weekly Off' | 'Holiday';
  checkInTime?: string;
  checkOutTime?: string;
  overtimeHours?: string;
  notes?: string;
}

export interface SalaryRecord {
  id: number;
  employeeId: number;
  salaryMonth: string;
  basicSalary: string;
  overtimePay: string;
  allowance: string;
  deduction: string;
  advance: string;
  netSalary: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  clientId: number;
  invoiceDate: string;
  billingPeriod: string;
  serviceDescription: string;
  manpowerCount: number;
  ratePerManpower: string;
  amount: string;
  gstRate: string;
  gstAmount: string;
  totalAmount: string;
  paidAmount: string;
  balanceAmount: string;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  notes?: string;
}

export interface ClientPaymentRecord {
  id: number;
  clientId: number;
  invoiceNumber: string;
  billingMonth: string;
  invoiceAmount: string;
  amountReceived: string;
  balanceAmount: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  transactionRef?: string;
}

export interface LeaveItem {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export type LeaveRequest = LeaveItem;

export interface DocumentItem {
  id: number;
  title: string;
  documentType: string;
  relatedType: string;
  relatedId?: number | null;
  fileUrl: string;
  expiryDate?: string;
  status: string;
  uploadedAt?: string;
}

export interface ShiftItem {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  hours?: number;
  description?: string;
  isActive?: boolean;
}

export interface EnquiryItem {
  id: number;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  requiredService?: string;
  serviceRequired?: string;
  numberOfStaff?: number;
  numberOfPersonnel?: number;
  location?: string;
  requirementDetails?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Converted' | 'Rejected' | 'Closed';
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface UserItem {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'hr' | 'accountant' | 'supervisor';
  phone?: string;
  isActive: boolean;
}
