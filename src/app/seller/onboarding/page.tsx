'use client';

import { useState, useEffect } from 'react';
import { Building2, Store, PhoneCall, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState('INDIVIDUAL');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('+8801900000001');
  const [nidNumber, setNidNumber] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [taxId, setTaxId] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedStore, setSubmittedStore] = useState<any | null>(null);

  useEffect(() => {
    // Check existing store application status
    fetch('/api/seller/onboarding')
      .then((res) => res.json())
      .then((data) => {
        if (data.store) {
          setSubmittedStore(data.store);
          setName(data.store.name || '');
          setSlug(data.store.slug || '');
          setDescription(data.store.description || '');
          if (data.store.businessType) setBusinessType(data.store.businessType);
        }
      })
      .catch(() => {});
  }, []);

  const handleNextStep = () => {
    if (step === 2 && (!name || !slug)) {
      setError('Please provide store name and unique URL slug.');
      return;
    }
    setError('');
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        name,
        slug,
        description,
        businessType,
        taxId,
        tradeLicenseNumber,
        nidNumber,
        verificationDocs: { nidFront: 'encrypted-doc-nid-1.jpg', tradeLicenseDoc: 'encrypted-license-1.pdf' },
        isDraft,
      };

      const res = await fetch('/api/seller/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmittedStore(data.store);
      setMessage(isDraft ? 'Store onboarding draft saved successfully.' : 'Store application submitted for Admin Review!');
    } catch (err: any) {
      setError(err.message || 'Onboarding submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submittedStore && submittedStore.status === 'UNDER_REVIEW') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-amber-100 text-amber-800 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Application Under Review</h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Your merchant store application <strong className="text-slate-900">&quot;{submittedStore.name}&quot;</strong> is currently being verified by the Nabrijan Admin Trust Team.
        </p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono max-w-sm mx-auto">
          <div>Status: <span className="font-bold text-amber-600 uppercase">{submittedStore.status}</span></div>
          <div>Submitted On: {new Date(submittedStore.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-black mb-1">Merchant Store Onboarding Wizard</h1>
        <p className="text-xs text-slate-400">Join 5,000+ verified Bangladeshi sellers and launch your store in minutes</p>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mt-6 text-[10px] font-bold">
          {['1. Business Type', '2. Store Details', '3. Contact Info', '4. Verification', '5. Submit'].map((label, idx) => (
            <div
              key={label}
              className={`py-1.5 px-2 rounded-lg text-center transition ${
                step === idx + 1 ? 'bg-emerald-600 text-white' : step > idx + 1 ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl mb-6 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-xs space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Step 1: Select Business Entity Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setBusinessType('INDIVIDUAL')}
                className={`p-4 border rounded-xl text-left space-y-2 transition ${
                  businessType === 'INDIVIDUAL' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'
                }`}
              >
                <div className="text-sm font-bold">Individual Merchant</div>
                <p className="text-[11px] text-slate-500 font-normal">For local artisans, small shop owners, and home business entrepreneurs.</p>
              </button>

              <button
                type="button"
                onClick={() => setBusinessType('REGISTRATION')}
                className={`p-4 border rounded-xl text-left space-y-2 transition ${
                  businessType === 'REGISTRATION' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'
                }`}
              >
                <div className="text-sm font-bold">Registered Company</div>
                <p className="text-[11px] text-slate-500 font-normal">For registered private limited businesses with Trade License and e-TIN.</p>
              </button>

              <button
                type="button"
                onClick={() => setBusinessType('OFFICIAL_STORE')}
                className={`p-4 border rounded-xl text-left space-y-2 transition ${
                  businessType === 'OFFICIAL_STORE' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'
                }`}
              >
                <div className="text-sm font-bold">Official Flagship Store</div>
                <p className="text-[11px] text-slate-500 font-normal">For major brand manufacturers and authorized sole distributors.</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Step 2: Store Profile & URL</h2>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Store Brand Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  placeholder="e.g. Dhaka Electronics Plaza"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Unique Store URL Handle Slug</label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 px-3 py-2 rounded-l-lg text-slate-500">nabrijan.com/store/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="dhaka-electronics"
                    className="w-full px-3 py-2 border rounded-r-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Store Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the products and specialty of your store..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Step 3: Merchant Contact & Operations</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Official Mobile Number (+880)</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Operational Division</label>
                <input type="text" defaultValue="Dhaka" className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Step 4: National Verification & Documents</h2>
            <p className="text-slate-500 text-[11px]">Documents are stored securely and encrypted. They will not be publicly displayed.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">National ID (NID) Number</label>
                <input
                  type="text"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  placeholder="1990123456789"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Trade License Number (If Applicable)</label>
                <input
                  type="text"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  placeholder="TRAD/DNCC/123456/2026"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Step 5: Summary & Submission</h2>
            <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
              <div>Store Name: <strong className="text-slate-900">{name}</strong></div>
              <div>Store URL: <strong className="text-emerald-700">nabrijan.com/store/{slug}</strong></div>
              <div>Business Type: <strong className="text-slate-900">{businessType}</strong></div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow"
              >
                {loading ? 'Submitting Application...' : 'Submit Application for Review'}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between border-t pt-4">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-100 disabled:opacity-50 text-slate-700 font-bold rounded-lg flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {step < 5 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center space-x-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
