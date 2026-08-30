'use client';

import React, { useState } from 'react';
import { Users, Plus, Shield, UserCheck, Trash2, Mail } from 'lucide-react';

export default function SellerTeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MANAGER');

  const members = [
    { id: 'mem-1', name: 'Kamal Ahmed', email: 'seller1@nabrijan.com', role: 'OWNER', status: 'ACTIVE' },
    { id: 'mem-2', name: 'Nusrat Jahan', email: 'nusrat.staff@nabrijan.com', role: 'ORDER_MANAGER', status: 'ACTIVE' },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${email} for role ${role}!`);
    setEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Users className="w-4 h-4 text-pink-400" />
            <span>Store Staff & Permission Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Team Management</h1>
          <p className="text-xs text-slate-300 mt-1">
            Invite store managers, product uploader staff, and order processing agents with granular role permissions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(!showInviteModal)}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center space-x-2 hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* Invite Form */}
      {showInviteModal && (
        <form onSubmit={handleInvite} className="bg-slate-900 border border-pink-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white">Invite New Store Staff Member</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Staff Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@store.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Staff Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="MANAGER">Store Manager (All except Payouts)</option>
                <option value="ORDER_MANAGER">Order Fulfillment Manager</option>
                <option value="PRODUCT_MANAGER">Product Catalog Specialist</option>
                <option value="CUSTOMER_SUPPORT">Customer Support Agent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black rounded-xl shadow"
            >
              Send Invitation
            </button>
          </div>
        </form>
      )}

      {/* Members List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-black text-xs text-slate-400 uppercase tracking-widest">
          Active Store Staff ({members.length})
        </div>

        <div className="divide-y divide-slate-800">
          {members.map((m) => (
            <div key={m.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-850/50 transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-pink-950 border border-pink-500/40 text-pink-300 flex items-center justify-center font-black text-sm">
                  {m.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{m.name}</span>
                    <span className="text-[10px] font-black bg-pink-950 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-md">
                      {m.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.email}</div>
                </div>
              </div>

              {m.role !== 'OWNER' && (
                <button
                  onClick={() => alert(`Removed ${m.name} from store staff.`)}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
