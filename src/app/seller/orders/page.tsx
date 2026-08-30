'use client';

import React, { useState } from 'react';
import { Package, Truck, Clock, CheckCircle, Search, MapPin, Send } from 'lucide-react';

export default function SellerOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [courierModalOrder, setCourierModalOrder] = useState<any | null>(null);

  const sampleOrders = [
    {
      id: 'ORD-98412',
      customerName: 'Rafiqul Islam',
      phone: '01711002233',
      address: 'House 42, Road 11, Dhanmondi, Dhaka',
      items: 'Xiaomi Redmi Note 13 Pro 5G (8GB/256GB)',
      total: 29999,
      paymentStatus: 'PAID',
      paymentMethod: 'OWNPAY_DIRECT',
      orderStatus: 'PROCESSING',
      date: '25 mins ago',
    },
    {
      id: 'ORD-97810',
      customerName: 'Nusrat Jahan',
      phone: '01899887766',
      address: 'Zindabazar, Sylhet Sadar',
      items: 'Jamdani Saree (Handcrafted)',
      total: 8500,
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH_ON_DELIVERY',
      orderStatus: 'PENDING',
      date: '2 hours ago',
    },
  ];

  const handleBookCourier = (order: any) => {
    alert(`Parcel for Order #${order.id} booked with Steadfast Courier! Consignment ID: ST-${Date.now().toString().slice(-6)}`);
    setCourierModalOrder(null);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Package className="w-4 h-4 text-pink-400" />
            <span>Order Fulfillment & Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Merchant Orders</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 font-black text-xs text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>Active Orders ({sampleOrders.length})</span>
        </div>

        <div className="divide-y divide-slate-800">
          {sampleOrders.map((o) => (
            <div key={o.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-pink-400 text-xs">#{o.id}</span>
                  <span className="text-white font-bold text-sm">{o.customerName}</span>
                  <span className="text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    {o.paymentStatus} ({o.paymentMethod})
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium">{o.items}</div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span>{o.address} ({o.phone})</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-black text-white">৳{o.total}</div>
                  <div className="text-[10px] text-slate-400">{o.date}</div>
                </div>

                <button
                  onClick={() => setCourierModalOrder(o)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Book Courier Parcel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Modal */}
      {courierModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-pink-500/40 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Book Courier Dispatch ({courierModalOrder.id})</h3>
            <p className="text-xs text-slate-300">Select courier service for nationwide 64-district delivery:</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleBookCourier(courierModalOrder)}
                className="w-full p-4 bg-slate-950 border border-pink-500/40 rounded-2xl text-left hover:bg-pink-950/40 transition"
              >
                <div className="font-black text-white text-xs">Steadfast Courier Express</div>
                <div className="text-[10px] text-slate-400">Dhaka ৳60 | Outside Dhaka ৳120</div>
              </button>

              <button
                type="button"
                onClick={() => handleBookCourier(courierModalOrder)}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left hover:bg-slate-800 transition"
              >
                <div className="font-black text-white text-xs">Pathao Courier Parcel</div>
                <div className="text-[10px] text-slate-400">Same-day pickup and tracking</div>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCourierModalOrder(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
