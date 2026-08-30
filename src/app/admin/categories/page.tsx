'use client';

import { useState, useEffect } from 'react';
import { Layers, Plus, CheckCircle2, FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId, image, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Creation failed');

      setMessage(`Category "${name}" created successfully!`);
      setName('');
      setDescription('');
      setImage('');
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderTree className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Category Taxonomy Management</h1>
            <p className="text-xs text-slate-400">Configure parent/child category hierarchy, banner imagery, and catalog taxonomy</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Creation Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add New Category</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Category Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Smart Electronics" className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Parent Category (Optional)</label>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="">None (Top-Level Category)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Banner Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category SEO overview..." className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow">
              {saving ? 'Saving...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Categories Tree Table */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Existing Platform Categories ({categories.length})</h2>

          {loading ? (
            <div className="text-slate-500 py-12 text-center">Loading categories...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-700">
                    <th className="p-3">Category</th>
                    <th className="p-3">Parent</th>
                    <th className="p-3">Products Count</th>
                    <th className="p-3">Slug</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3 font-semibold text-slate-600">{c.parent ? c.parent.name : '—'}</td>
                      <td className="p-3 font-bold text-emerald-700">{c._count?.products || 0} Products</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">/category/{c.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
