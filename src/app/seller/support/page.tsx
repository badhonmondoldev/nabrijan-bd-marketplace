'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

export default function SellerSupportPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('ACCOUNT');
  const [message, setMessage] = useState('');

  const sampleTickets = [
    {
      id: 'TICK-8412',
      subject: 'Payout Bank Verification Confirmation',
      category: 'PAYMENTS',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdAt: '2 hours ago',
      lastMessage: 'Support Agent is reviewing your uploaded bank statement copy.',
    },
    {
      id: 'TICK-7910',
      subject: 'Store Category Expansion Request',
      category: 'ACCOUNT',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '3 days ago',
      lastMessage: 'Category approval granted for Electronics & Gadgets.',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Support ticket "${subject}" created successfully! Support team will respond within 4 hours.`);
    setSubject('');
    setMessage('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-4 h-4 text-pink-400" />
            <span>Seller Helpdesk & Priority Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Support Tickets</h1>
          <p className="text-xs text-slate-300 mt-1">
            Submit inquiries, request category permissions, or get assistance with orders and payments.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center space-x-2 hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Ticket Create Form */}
      {showCreate && (
        <form onSubmit={handleCreateTicket} className="bg-slate-900 border border-pink-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white">Create Support Ticket</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ticket Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question regarding withdrawal processing"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="ACCOUNT">Account & Verification</option>
                <option value="ORDERS">Order & Shipping Help</option>
                <option value="PAYMENTS">Payout & Bank Wallet</option>
                <option value="TECHNICAL">Technical Platform Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Inquiry</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or request in detail..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="space-y-3">
        {sampleTickets.map((ticket) => (
          <div key={ticket.id} className="bg-slate-900 border border-slate-800 hover:border-pink-500/30 p-5 rounded-2xl transition space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-black text-pink-400 text-xs">{ticket.id}</span>
                <span className="text-white font-bold text-sm">{ticket.subject}</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                ticket.status === 'OPEN'
                  ? 'bg-pink-950 text-pink-300 border-pink-500/40'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              }`}>
                {ticket.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              {ticket.lastMessage}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Category: <strong className="text-slate-300">{ticket.category}</strong></span>
              <span>Created {ticket.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
