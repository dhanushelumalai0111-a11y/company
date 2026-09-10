import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  ArrowRightLeft,
  Building,
  User,
  Clock,
  CheckCircle,
  Calendar,
  X,
  Save,
  Search
} from 'lucide-react';
import { DeploymentItem, EmployeeItem, ClientItem, ShiftItem } from '../../types.ts';

interface DeploymentManagementProps {
  deployments: DeploymentItem[];
  employees: EmployeeItem[];
  clients: ClientItem[];
  shifts: ShiftItem[];
  onRefresh: () => void;
}

export const DeploymentManagement: React.FC<DeploymentManagementProps> = ({
  deployments = [],
  employees = [],
  clients = [],
  shifts = [],
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentItem | null>(null);
  const [loading, setLoading] = useState(false);

  const safeDeployments = Array.isArray(deployments) ? deployments : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeShifts = Array.isArray(shifts) ? shifts : [];

  // New Deployment Form
  const [deployForm, setDeployForm] = useState({
    employeeId: safeEmployees[0]?.id || '',
    clientId: safeClients[0]?.id || '',
    jobRole: 'Security Guard - Main Gate',
    workLocation: 'Electronic City, Bengaluru',
    shiftId: safeShifts[0]?.id || '',
    joiningDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Transfer Form
  const [transferForm, setTransferForm] = useState({
    employeeId: 0,
    newClientId: safeClients[0]?.id || '',
    newRole: 'Site Security Guard',
    newLocation: 'Bommanahalli, Bengaluru',
    newShiftId: safeShifts[0]?.id || '',
    transferDate: new Date().toISOString().split('T')[0],
    notes: 'Client relocation request',
  });

  const getEmployee = (id: number) => safeEmployees.find((e) => e.id === id);
  const getClient = (id: number) => safeClients.find((c) => c.id === id);
  const getShift = (id?: number) => safeShifts.find((s) => s.id === id);

  const filteredDeployments = safeDeployments.filter((d) => {
    if (!d) return false;
    const emp = getEmployee(d.employeeId);
    const client = getClient(d.clientId);
    const search = searchTerm.toLowerCase();
    const empName = (emp?.fullName || '').toLowerCase();
    const clientName = (client?.companyName || '').toLowerCase();
    const loc = (d.workLocation || '').toLowerCase();
    const role = (d.jobRole || '').toLowerCase();
    return (
      empName.includes(search) ||
      clientName.includes(search) ||
      loc.includes(search) ||
      role.includes(search)
    );
  });

  const handleOpenTransfer = (dep: DeploymentItem) => {
    setSelectedDeployment(dep);
    setTransferForm({
      employeeId: dep.employeeId,
      newClientId: clients.find((c) => c.id !== dep.clientId)?.id || clients[0]?.id || '',
      newRole: dep.jobRole,
      newLocation: dep.workLocation,
      newShiftId: dep.shiftId || shifts[0]?.id || '',
      transferDate: new Date().toISOString().split('T')[0],
      notes: 'Transfer to support surge requirement',
    });
    setTransferModalOpen(true);
  };

  const handleDeploySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to deploy employee');
      }

      setDeployModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Deploy error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/deployments/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Transfer failed');
      }

      setTransferModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Transfer error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Deployment & Site Rosters</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign guards and tradesmen to client premises, manage site posts, and execute instant site transfers.
          </p>
        </div>
        <button
          onClick={() => setDeployModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Deploy Personnel
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by guard name, client site, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Active Deployments: <strong className="text-blue-600">{safeDeployments.filter(d => d && d.status === 'Active').length}</strong>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Client Enterprise</th>
                <th className="py-3.5 px-4">Job Role / Post</th>
                <th className="py-3.5 px-4">Shift Schedule</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeployments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No deployment records found.
                  </td>
                </tr>
              ) : (
                filteredDeployments.map((dep) => {
                  const emp = getEmployee(dep.employeeId);
                  const client = getClient(dep.clientId);
                  const shift = getShift(dep.shiftId);

                  return (
                    <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            <img
                              src={emp?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={emp?.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{emp?.fullName || 'Staff ID ' + dep.employeeId}</div>
                            <div className="text-[10px] text-blue-600 font-mono">{emp?.employeeCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{client?.companyName || 'Client ID ' + dep.clientId}</div>
                        <div className="text-[10px] text-slate-500">{dep.workLocation}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {dep.jobRole}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          {shift?.name || 'General Shift'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {shift ? `${shift.startTime} - ${shift.endTime}` : '09:00 - 18:00'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {dep.joiningDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dep.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {dep.status === 'Active' && (
                          <button
                            onClick={() => handleOpenTransfer(dep)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            Transfer
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

      {/* Deploy Modal */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setDeployModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deploy Staff Member</h3>

            <form onSubmit={handleDeploySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Employee *</label>
                <select
                  value={deployForm.employeeId}
                  onChange={(e) => setDeployForm({ ...deployForm, employeeId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.employeeCode}) - {e.serviceType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Client Site *</label>
                <select
                  value={deployForm.clientId}
                  onChange={(e) => setDeployForm({ ...deployForm, clientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} - {c.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Role / Post</label>
                  <input
                    type="text"
                    required
                    value={deployForm.jobRole}
                    onChange={(e) => setDeployForm({ ...deployForm, jobRole: e.target.value })}
                    placeholder="e.g. Main Gate Sentry"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Schedule</label>
                  <select
                    value={deployForm.shiftId}
                    onChange={(e) => setDeployForm({ ...deployForm, shiftId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Location</label>
                <input
                  type="text"
                  required
                  value={deployForm.workLocation}
                  onChange={(e) => setDeployForm({ ...deployForm, workLocation: e.target.value })}
                  placeholder="Premises address / Gate"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  required
                  value={deployForm.joiningDate}
                  onChange={(e) => setDeployForm({ ...deployForm, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setDeployModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  {loading ? 'Deploying...' : 'Confirm Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setTransferModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Transfer Staff to Another Client</h3>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border text-slate-700">
                Staff: <strong>{getEmployee(transferForm.employeeId)?.fullName}</strong> ({getEmployee(transferForm.employeeId)?.employeeCode})
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Client Site *</label>
                <select
                  value={transferForm.newClientId}
                  onChange={(e) => setTransferForm({ ...transferForm, newClientId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Job Role</label>
                  <input
                    type="text"
                    required
                    value={transferForm.newRole}
                    onChange={(e) => setTransferForm({ ...transferForm, newRole: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={transferForm.newShiftId}
                    onChange={(e) => setTransferForm({ ...transferForm, newShiftId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Effective Transfer Date</label>
                <input
                  type="date"
                  required
                  value={transferForm.transferDate}
                  onChange={(e) => setTransferForm({ ...transferForm, transferDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Reason / Notes</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  placeholder="Reason for transfer"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  {loading ? 'Processing...' : 'Complete Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
