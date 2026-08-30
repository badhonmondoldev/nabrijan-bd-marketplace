'use client';

import { useState, useEffect } from 'react';
import { FileCheck, Search, Clock, User, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) setLogs(data.auditLogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <FileCheck className="w-6 h-6 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-black">System Audit Trail & Governance Log</h1>
            <p className="text-xs text-slate-400">Complete immutable audit trail tracking actor, action, timestamp, and target resource</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by action (e.g. USER_SUSPENDED, SELLER_VERIFIED, PRODUCT_MODERATED)..."
          className="flex-1 border-none focus:outline-none text-slate-800 font-medium"
        />
        <button onClick={fetchLogs} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold">
          Filter Audit Log
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-xs text-slate-500 py-12 text-center">Fetching audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-xs text-slate-500 py-12 text-center border border-dashed rounded-xl">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor (User)</th>
                  <th className="p-3">Executed Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{log.user?.name || 'System / Guest'}</div>
                      <div className="text-[10px] text-slate-500">{log.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{log.entity}</div>
                      <div className="font-mono text-[10px] text-slate-400">#{log.entityId?.slice(0, 8)}</div>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
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
