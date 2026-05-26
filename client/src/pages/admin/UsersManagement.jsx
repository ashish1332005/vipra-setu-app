import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, toggleUserStatus, deleteUser } = useGlobalContext();
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (userId) => {
    toggleUserStatus(userId);
    setActiveDropdown(null);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    setActiveDropdown(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">View and manage registered users and professionals.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
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
              {filteredUsers.map((user) => (
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
              
              {filteredUsers.length === 0 && (
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
