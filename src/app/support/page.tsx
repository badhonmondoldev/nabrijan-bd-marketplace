'use client';

import { useState } from 'react';
import { HelpCircle, PhoneCall, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function SupportHelpPage() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-3 shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-emerald-600/30 text-emerald-400 font-bold px-3 py-1 rounded-full text-[11px]">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Nabrijan Customer Support Desk</span>
        </div>
        <h1 className="text-3xl font-black">Help Center & Live Customer Support</h1>
        <p className="text-slate-300 leading-relaxed">
          Need assistance with an order, seller inquiry, wallet refund, or affiliate account? Contact our 24/7 Bangladesh support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2 text-center">
          <PhoneCall className="w-6 h-6 text-emerald-600 mx-auto" />
          <div className="font-bold text-slate-900 text-sm">Customer Helpline</div>
          <div className="text-slate-500 font-mono">+880 9612-345678</div>
          <div className="text-[10px] text-slate-400">Sun - Thu (9:00 AM - 9:00 PM)</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2 text-center">
          <Mail className="w-6 h-6 text-indigo-600 mx-auto" />
          <div className="font-bold text-slate-900 text-sm">Email Support</div>
          <div className="text-slate-500 font-mono">support@nabrijan.com</div>
          <div className="text-[10px] text-slate-400">Response within 4 hours</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2 text-center">
          <MessageSquare className="w-6 h-6 text-amber-600 mx-auto" />
          <div className="font-bold text-slate-900 text-sm">Live Support Chat</div>
          <div className="text-emerald-700 font-bold">Available In-App</div>
          <div className="text-[10px] text-slate-400">Instant agent connection</div>
        </div>
      </div>

      {/* Submit Support Ticket Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
          <Send className="w-4 h-4 text-emerald-600" />
          <span>Submit Support Inquiry Ticket</span>
        </h2>

        {submitted ? (
          <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Support ticket submitted successfully! Reference ID: <strong>#TKT-{Date.now().toString().slice(-6)}</strong>. Our team will contact you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Subject / Issue Category</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Order Delivery Status or Payment Refund Inquiry"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Inquiry Message</label>
              <textarea
                required
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please describe your issue, order number, and phone number..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow">
              Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
