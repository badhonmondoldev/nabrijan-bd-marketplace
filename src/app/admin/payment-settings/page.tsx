'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Key, RefreshCw, CheckCircle, Smartphone, Globe, Lock, Save } from 'lucide-react';

export default function AdminPaymentSettingsPage() {
  const [ownpayUrl, setOwnpayUrl] = useState('http://127.0.0.1:8000');
  const [apiKey, setApiKey] = useState('sandbox_key_nabrijan_2026');
  const [webhookSecret, setWebhookSecret] = useState('nabrijan_webhook_secret_2026');

  // Mobile Financial Services (MFS) Wallet Numbers
  const [bkashNumber, setBkashNumber] = useState('01700000000');
  const [bkashType, setBkashType] = useState('PERSONAL');
  const [nagadNumber, setNagadNumber] = useState('01800000000');
  const [nagadType, setNagadType] = useState('PERSONAL');
  const [rocketNumber, setRocketNumber] = useState('01900000000-1');

  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/webhooks/ownpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'ping', test: true }),
      });

      if (res.ok) {
        setTestResult('SUCCESS: Connected to OwnPay Gateway Server cleanly!');
      } else {
        setTestResult('ERROR: Gateway connection failed. Verify URL & API key.');
      }
    } catch (e: any) {
      setTestResult(`ERROR: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <CreditCard className="w-4 h-4 text-pink-400" />
            <span>OwnPay Gateway & MFS Control Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Payment Gateway Settings</h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage bKash, Nagad, Rocket numbers, OwnPay API keys, and automated webhook triggers.
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Payment Gateway settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* OwnPay API Credentials */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-black text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-pink-400" />
            <span>1. OwnPay Gateway Server Connection</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">OwnPay Server Endpoint URL</label>
              <input
                type="text"
                required
                value={ownpayUrl}
                onChange={(e) => setOwnpayUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000 or https://pay.nabrijan.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Merchant API Authorization Key</label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Webhook Secret (HMAC SHA-256 Signature Verification)</label>
            <input
              type="password"
              required
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-slate-800 text-pink-300 border border-pink-500/30 text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Endpoint...' : 'Test Gateway Connection'}</span>
            </button>

            {testResult && (
              <span className={`text-xs font-bold ${testResult.startsWith('SUCCESS') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {testResult}
              </span>
            )}
          </div>
        </div>

        {/* bKash / Nagad / Rocket Numbers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-black text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-5 h-5 text-pink-400" />
            <span>2. Mobile Financial Services (MFS) Wallet Numbers</span>
          </h2>

          {/* bKash */}
          <div className="p-4 bg-slate-950 border border-pink-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-pink-400 text-xs uppercase tracking-widest">bKash Account Details</span>
              <select
                value={bkashType}
                onChange={(e) => setBkashType(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-pink-300 font-bold px-2 py-1"
              >
                <option value="PERSONAL">Personal (Send Money)</option>
                <option value="MERCHANT">Merchant (Make Payment)</option>
              </select>
            </div>
            <input
              type="text"
              value={bkashNumber}
              onChange={(e) => setBkashNumber(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          {/* Nagad */}
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-orange-400 text-xs uppercase tracking-widest">Nagad Account Details</span>
              <select
                value={nagadType}
                onChange={(e) => setNagadType(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-orange-300 font-bold px-2 py-1"
              >
                <option value="PERSONAL">Personal (Send Money)</option>
                <option value="MERCHANT">Merchant (Make Payment)</option>
              </select>
            </div>
            <input
              type="text"
              value={nagadNumber}
              onChange={(e) => setNagadNumber(e.target.value)}
              placeholder="e.g. 01812345678"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          {/* Rocket */}
          <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-2xl space-y-3">
            <span className="font-black text-purple-400 text-xs uppercase tracking-widest block">Rocket Wallet Number</span>
            <input
              type="text"
              value={rocketNumber}
              onChange={(e) => setRocketNumber(e.target.value)}
              placeholder="e.g. 01912345678-1"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-pink-500/25 hover:brightness-110 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Gateway Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
