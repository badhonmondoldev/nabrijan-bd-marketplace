'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle2, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}&role=${roleFilter}`);
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId: string, currentSuspended: boolean) => {
    if (!confirm(`Are you sure you want to ${currentSuspended ? 'activate' : 'suspend'} this user?`)) return;
    setUpdating(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isSuspended: !currentSuspended,
          reason: 'Administrative policy action',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(`User account ${!currentSuspended ? 'suspended' : 'activated'} successfully.`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">User Governance & Roles Directory</h1>
            <p className="text-xs text-slate-400">Search users, inspect role capabilities, and manage account suspensions</p>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {['ALL', 'BUYER', 'SELLER', 'AFFILIATE', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg transition uppercase ${
                roleFilter === r ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by User Name, Email, or Phone (+8801...)"
          className="flex-1 border-none focus:outline-none text-slate-800 font-medium"
        />
        <button onClick={fetchUsers} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold">
          Search Users
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-xs text-slate-500 py-12 text-center">Fetching user directory...</div>
        ) : users.length === 0 ? (
          <div className="text-xs text-slate-500 py-12 text-center border border-dashed rounded-xl">No users found matching query.</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">User Details</th>
                  <th className="p-3">Contact Information</th>
                  <th className="p-3">Assigned Roles</th>
                  <th className="p-3">Associated Store</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: #{u.id.slice(0, 8)}</div>
                    </td>
                    <td className="p-3">
                      <div>{u.email}</div>
                      <div className="font-mono text-slate-500">{u.phone || 'N/A'}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.map((r: any) => (
                          <span key={r.id} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {r.role?.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-semibold">
                      {u.stores?.[0] ? u.stores[0].name : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3">
                      {u.status === 'SUSPENDED' ? (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center w-fit space-x-1">
                          <UserX className="w-3 h-3" />
                          <span>SUSPENDED</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center w-fit space-x-1">
                          <UserCheck className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleSuspend(u.id, u.status === 'SUSPENDED')}
                        disabled={updating}
                        className={`font-bold px-3 py-1.5 rounded-lg text-white shadow ${
                          u.status === 'SUSPENDED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {u.status === 'SUSPENDED' ? 'Activate User' : 'Suspend Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
