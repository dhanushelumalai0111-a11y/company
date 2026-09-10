import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  Shield,
  X,
  Save,
  Building,
  FileCheck
} from 'lucide-react';
import { EmployeeItem, ClientItem } from '../../types.ts';

interface EmployeeManagementProps {
  employees: EmployeeItem[];
  clients: ClientItem[];
  onRefresh: () => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees = [],
  clients = [],
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<EmployeeItem | null>(null);
  const [loading, setLoading] = useState(false);

  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    phone: '',
    email: '',
    address: 'Bommana Halli, Bengaluru',
    dateOfJoining: new Date().toISOString().split('T')[0],
    serviceType: 'Security Guard Services',
    assignedClientId: '' as string | number,
    designation: 'Security Guard',
    salary: '18000.00',
    status: 'Active' as 'Active' | 'Inactive' | 'On Leave',
    emergencyContact: '',
    idProofStatus: 'Verified' as 'Verified' | 'Pending' | 'Missing',
    addressProofStatus: 'Verified' as 'Verified' | 'Pending' | 'Missing',
    policeVerificationStatus: 'Verified' as 'Verified' | 'Pending' | 'Missing',
    trainingCertStatus: 'Verified' as 'Verified' | 'Pending' | 'Missing',
    notes: '',
  });

  const serviceOptions = [
    'Security Guard Services',
    'Gun Men / Armed Security Services',
    'House Keeping Services',
    'Driver Services',
    'Office Boy Services',
    'Swimming Pool Operator Services',
    'Facility Management',
    'Receptionist Services',
    'Maintenance Staff',
    'Man Power Supply',
    'Other customized manpower services',
  ];

  const filteredEmployees = safeEmployees.filter((emp) => {
    if (!emp) return false;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (emp.fullName || '').toLowerCase().includes(term) ||
      (emp.employeeCode || '').toLowerCase().includes(term) ||
      (emp.phone || '').toLowerCase().includes(term) ||
      (emp.designation || '').toLowerCase().includes(term);
    const matchesService = filterService === 'all' || emp.serviceType === filterService;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesService && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormData({
      employeeCode: `SMSF-${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: '',
      email: '',
      address: 'Bommana Halli, Bengaluru',
      dateOfJoining: new Date().toISOString().split('T')[0],
      serviceType: 'Security Guard Services',
      assignedClientId: clients[0]?.id || '',
      designation: 'Security Guard',
      salary: '18000.00',
      status: 'Active',
      emergencyContact: '',
      idProofStatus: 'Verified',
      addressProofStatus: 'Verified',
      policeVerificationStatus: 'Verified',
      trainingCertStatus: 'Verified',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeItem) => {
    setEditingEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      fullName: emp.fullName,
      photoUrl: emp.photoUrl || '',
      phone: emp.phone,
      email: emp.email || '',
      address: emp.address,
      dateOfJoining: emp.dateOfJoining,
      serviceType: emp.serviceType,
      assignedClientId: emp.assignedClientId || '',
      designation: emp.designation,
      salary: emp.salary,
      status: emp.status,
      emergencyContact: emp.emergencyContact || '',
      idProofStatus: emp.idProofStatus || 'Verified',
      addressProofStatus: emp.addressProofStatus || 'Verified',
      policeVerificationStatus: emp.policeVerificationStatus || 'Verified',
      trainingCertStatus: emp.trainingCertStatus || 'Verified',
      notes: emp.notes || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to delete employee');
        return;
      }
      onRefresh();
    } catch (e) {
      alert('Error deleting employee');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees';
      const method = editingEmployee ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save employee');
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Save error');
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId?: number | null) => {
    if (!clientId) return 'Unassigned';
    const c = clients.find((item) => item.id === clientId);
    return c ? c.companyName : 'Assigned Client';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff & Guard Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active security guards, armed gunmen, housekeeping, drivers, pool operators, and maintenance tradesmen.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Enrol New Staff
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID code, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Service:</span>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none"
            >
              <option value="all">All Services</option>
              {serviceOptions.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none"
            >
              <option value="all">All ({employees.length})</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Service & Role</th>
                <th className="py-3.5 px-4">Assigned Client Site</th>
                <th className="py-3.5 px-4">Police & ID Check</th>
                <th className="py-3.5 px-4">Monthly Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No personnel found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300 shrink-0">
                          <img
                            src={emp.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={emp.fullName}
                            className="w-full h-full object-cover"
                            onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{emp.fullName}</div>
                          <div className="text-[10px] text-blue-600 font-mono font-semibold">{emp.employeeCode}</div>
                          <div className="text-[10px] text-slate-400">{emp.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{emp.designation}</div>
                      <div className="text-[11px] text-slate-500">{emp.serviceType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{getClientName(emp.assignedClientId)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.policeVerificationStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {emp.policeVerificationStatus === 'Verified' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          Police: {emp.policeVerificationStatus || 'Verified'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Aadhaar: {emp.idProofStatus || 'Verified'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(emp.salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingEmployee(emp)}
                        title="View Profile"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        title="Edit Personnel"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        title="Delete Personnel"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingEmployee ? 'Edit Staff Details' : 'Enrol Security / Manpower Personnel'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Manjunath Swamy"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Spouse/Parent Phone"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Type *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {serviceOptions.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Security Guard"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Client Site</label>
                  <select
                    value={formData.assignedClientId}
                    onChange={(e) => setFormData({ ...formData, assignedClientId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Salary (₹) *</label>
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="18000.00"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permanent Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Permanent village / town address"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Statutory & Verification Status */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Verification & Compliance Checklist</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Police Verification</label>
                    <select
                      value={formData.policeVerificationStatus}
                      onChange={(e) => setFormData({ ...formData, policeVerificationStatus: e.target.value as any })}
                      className="w-full p-1.5 border rounded bg-white"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Aadhaar / ID Proof</label>
                    <select
                      value={formData.idProofStatus}
                      onChange={(e) => setFormData({ ...formData, idProofStatus: e.target.value as any })}
                      className="w-full p-1.5 border rounded bg-white"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Address Proof</label>
                    <select
                      value={formData.addressProofStatus}
                      onChange={(e) => setFormData({ ...formData, addressProofStatus: e.target.value as any })}
                      className="w-full p-1.5 border rounded bg-white"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Training Certificate</label>
                    <select
                      value={formData.trainingCertStatus}
                      onChange={(e) => setFormData({ ...formData, trainingCertStatus: e.target.value as any })}
                      className="w-full p-1.5 border rounded bg-white"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Staff Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Profile Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <img
                    src={viewingEmployee.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={viewingEmployee.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{viewingEmployee.fullName}</h3>
                  <p className="text-xs text-blue-600 font-mono">{viewingEmployee.employeeCode}</p>
                </div>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <strong className="text-slate-800">Designation:</strong> {viewingEmployee.designation}
              </div>
              <div>
                <strong className="text-slate-800">Service Category:</strong> {viewingEmployee.serviceType}
              </div>
              <div>
                <strong className="text-slate-800">Assigned Client:</strong> {getClientName(viewingEmployee.assignedClientId)}
              </div>
              <div>
                <strong className="text-slate-800">Phone:</strong> {viewingEmployee.phone}
              </div>
              <div>
                <strong className="text-slate-800">Emergency Contact:</strong> {viewingEmployee.emergencyContact || 'N/A'}
              </div>
              <div>
                <strong className="text-slate-800">Date of Joining:</strong> {viewingEmployee.dateOfJoining}
              </div>
              <div>
                <strong className="text-slate-800">Monthly Salary:</strong> ₹{Number(viewingEmployee.salary).toLocaleString('en-IN')}
              </div>
              <div>
                <strong className="text-slate-800">Residential Address:</strong> {viewingEmployee.address}
              </div>

              <div className="pt-2 border-t mt-2">
                <div className="font-bold text-slate-800 mb-1">Compliance & Verification:</div>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    Police Check: {viewingEmployee.policeVerificationStatus}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    Aadhaar ID: {viewingEmployee.idProofStatus}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                    Training: {viewingEmployee.trainingCertStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
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
