import { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Trash2, ShieldAlert, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, usersLoading, toggleUserStatus, deleteUser, loadAdminUsers, approveProvider } = useGlobalContext();
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminUsers().catch((err) => {
      setError(getApiErrorMessage(err, 'Unable to load users from backend'));
    });
  }, [loadAdminUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      setActiveDropdown(null);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update user status'));
    }
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    setActiveDropdown(null);
  };

  const handleApproveProvider = async (userId) => {
    try {
      await approveProvider(userId);
      setActiveDropdown(null);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to approve provider'));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Accounts</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">User Management</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">View and manage registered users and professionals.</p>
        </div>
        
        <div className="grid gap-3 sm:flex sm:items-center">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-64"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Banned">Banned</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {error && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 sm:px-6">
            {error}
          </div>
        )}
        <div className="grid gap-3 p-3 md:hidden">
          {usersLoading && <p className="py-8 text-center text-sm font-bold text-slate-500">Loading users...</p>}
          {!usersLoading && filteredUsers.map((user) => (
            <article key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-black text-slate-950">{user.name}</h2>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">{user.email}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">{user.phone}</p>
                </div>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm"
                  aria-label="User actions"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                  user.role === 'Provider' ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-slate-700'
                }`}>
                  {user.role}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                  user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  user.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
                <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500">
                  {user.joined}
                </span>
              </div>

              {activeDropdown === user.id && (
                <div className="mt-4 grid gap-2">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-700"
                  >
                    {user.status === 'Active' ? <><ShieldAlert size={16} className="text-amber-500" /> Ban User</> : <><ShieldCheck size={16} className="text-emerald-500" /> Activate User</>}
                  </button>
                  {user.role === 'Provider' && user.status === 'Pending' && (
                    <button
                      onClick={() => handleApproveProvider(user.id)}
                      className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
                    >
                      <CheckCircle2 size={16} /> Approve Provider
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-600"
                  >
                    <Trash2 size={16} /> Delete User
                  </button>
                </div>
              )}
            </article>
          ))}
          {!usersLoading && filteredUsers.length === 0 && (
            <p className="py-8 text-center text-sm font-bold text-slate-500">No users found matching your filters.</p>
          )}
        </div>

        <div className="hidden min-h-[400px] overflow-x-auto md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email / Phone</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {usersLoading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!usersLoading && filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">ID: {user.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-700">{user.email}</div>
                    <div className="text-xs text-slate-500">{user.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Provider' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {user.joined}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                      user.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === user.id && (
                      <div className="absolute right-8 top-10 z-10 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          {user.status === 'Active' ? <><ShieldAlert size={16} className="text-amber-500" /> Ban User</> : <><ShieldCheck size={16} className="text-emerald-500" /> Activate User</>}
                        </button>
                        {user.role === 'Provider' && user.status === 'Pending' && (
                          <button
                            onClick={() => handleApproveProvider(user.id)}
                            className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Approve Provider
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {!usersLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
