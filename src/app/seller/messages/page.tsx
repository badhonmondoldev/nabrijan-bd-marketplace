'use client';

import React, { useState } from 'react';
import { MessageSquare, Search, Send, User, ShoppingBag } from 'lucide-react';

export default function SellerMessagesPage() {
  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [text, setText] = useState('');

  const conversations = [
    {
      id: 'conv-1',
      customerName: 'Rafiqul Islam',
      product: 'Xiaomi Redmi Note 13 Pro 5G',
      lastMessage: 'Is official warranty card included in the box?',
      time: '12 mins ago',
      unread: true,
      messages: [
        { sender: 'buyer', text: 'Assalamu Alaikum! Is official warranty card included in the box?', time: '12:40 PM' },
        { sender: 'seller', text: 'Walaikum Assalam! Yes, 100% official 1-year warranty card is included.', time: '12:42 PM' },
      ],
    },
    {
      id: 'conv-2',
      customerName: 'Sultana Razia',
      product: 'Hand-Embroidered Jamdani Saree',
      lastMessage: 'Can you deliver to Sylhet Sadar within 2 days?',
      time: '1 hour ago',
      unread: false,
      messages: [
        { sender: 'buyer', text: 'Can you deliver to Sylhet Sadar within 2 days?', time: '11:15 AM' },
      ],
    },
  ];

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    activeConv.messages.push({ sender: 'seller', text, time: 'Just now' });
    setText('');
  };

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span>Buyer-Seller Real-Time Chat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Buyer Messages</h1>
        </div>
      </div>

      {/* Chat Interface Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        {/* Conversations List */}
        <div className="border-r border-slate-800 p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3 rounded-2xl cursor-pointer transition ${
                  conv.id === activeConvId
                    ? 'bg-gradient-to-r from-pink-950 via-slate-900 to-slate-900 border border-pink-500/40'
                    : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>{conv.customerName}</span>
                  <span className="text-[10px] text-slate-400">{conv.time}</span>
                </div>
                <div className="text-[11px] text-pink-300 font-semibold truncate flex items-center space-x-1 mb-1">
                  <ShoppingBag className="w-3 h-3 text-pink-400 flex-shrink-0" />
                  <span className="truncate">{conv.product}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{conv.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-950/60">
          {/* Active Conversation Top Bar */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-pink-950 border border-pink-500/40 text-pink-300 flex items-center justify-center font-black text-xs">
                {activeConv.customerName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{activeConv.customerName}</div>
                <div className="text-[10px] text-pink-300 font-medium">Inquiring about {activeConv.product}</div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-3 overflow-y-auto p-2">
            {activeConv.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'seller' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                    msg.sender === 'seller'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message to buyer..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-2xl shadow-lg hover:brightness-110"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
