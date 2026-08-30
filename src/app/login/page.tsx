'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to home or account
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-emerald-600 text-white font-black text-2xl px-4 py-1 rounded-lg inline-block tracking-wider mb-2">
            NABRIJAN
          </div>
          <h2 className="text-xl font-bold text-slate-800">Login to Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">Unified login for Buyers, Sellers, Affiliates & Admins</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. superadmin@nabrijan.com"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm shadow transition flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-700">⚡ Test Seed Accounts (Supabase DB):</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('superadmin@nabrijan.com');
                setPassword('DevSeedSecret#2026');
              }}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold p-2 rounded-lg text-left text-[11px]"
            >
              👑 Admin Account
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('seller1@nabrijan.com');
                setPassword('DevSeedSecret#2026');
              }}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold p-2 rounded-lg text-left text-[11px]"
            >
              🏪 Merchant Account
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
