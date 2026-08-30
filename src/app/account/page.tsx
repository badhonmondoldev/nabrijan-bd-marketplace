'use client';

import { useState, useEffect } from 'react';
import { User, Shield, MapPin, Key, Store, Share2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { BANGLADESH_ADMINISTRATIVE_DATA } from '@/modules/addresses/data';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses' | 'roles'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Profile Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [nidNumber, setNidNumber] = useState('');

  // New Address Form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [division, setDivision] = useState(BANGLADESH_ADMINISTRATIVE_DATA[0].name);
  const [district, setDistrict] = useState(BANGLADESH_ADMINISTRATIVE_DATA[0].districts[0].name);
  const [upazila, setUpazila] = useState(BANGLADESH_ADMINISTRATIVE_DATA[0].districts[0].upazilas[0]);
  const [area, setArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchAddresses();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/account/profile');
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
        setBio(data.user.profile?.bio || '');
        setGender(data.user.profile?.gender || '');
        setNidNumber(data.user.profile?.nidNumber || '');
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error('Failed to load addresses', e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, bio, gender, nidNumber }),
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
        fetchProfileData();
      }
    } catch (e) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: addrName,
          phone: addrPhone,
          division,
          district,
          upazila,
          area,
          detailedAddress,
          postalCode,
          isDefault,
        }),
      });

      if (res.ok) {
        setShowAddAddress(false);
        setAddrName('');
        setAddrPhone('');
        setArea('');
        setDetailedAddress('');
        setPostalCode('');
        fetchAddresses();
      }
    } catch (e) {
      console.error('Address create error', e);
    } finally {
      setSaving(false);
    }
  };

  const handleEnableRole = async (roleToEnable: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/account/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleToEnable }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Role update error', e);
    } finally {
      setSaving(false);
    }
  };

  // Division select updates districts list
  const currentDivisionObj = BANGLADESH_ADMINISTRATIVE_DATA.find((d) => d.name === division) || BANGLADESH_ADMINISTRATIVE_DATA[0];
  const currentDistrictObj = currentDivisionObj.districts.find((dst) => dst.name === district) || currentDivisionObj.districts[0];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        Loading Unified Account Dashboard...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-600 mb-4">Please login to access your account.</p>
        <a href="/login" className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Login Now
        </a>
      </div>
    );
  }

  const activeRoles: string[] = userData.userRoles?.map((ur: any) => ur.role.name) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">{userData.name}</h1>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {userData.status}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">{userData.email} | {userData.phone || 'No phone added'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-xs">
            <span className="text-emerald-300 font-medium">Active Roles:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {activeRoles.map((role) => (
                <span key={role} className="bg-emerald-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 h-fit space-y-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'addresses'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>BD Delivery Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'roles'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Marketplace Roles & Identity</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Personal Profile & Verification
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">National ID (NID Number)</label>
                  <input
                    type="text"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="e.g. 1990123456789"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Notes</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Security & Session Password
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-xl text-xs space-y-3">
                <div className="font-semibold text-slate-700">Account Password</div>
                <p className="text-slate-600">Your password is securely encrypted using bcrypt (10 rounds).</p>
                <div className="pt-2">
                  <span className="text-slate-500 font-mono">FEATURE_FLAG_DISABLED: Password Reset via SMS/Email</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Bangladesh Delivery Addresses</h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase">New Address (Bangladesh)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Receiver Full Name"
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="px-3 py-2 text-xs border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Receiver Phone (+880)"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="px-3 py-2 text-xs border rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Division</label>
                      <select
                        value={division}
                        onChange={(e) => {
                          const newDiv = e.target.value;
                          setDivision(newDiv);
                          const divObj = BANGLADESH_ADMINISTRATIVE_DATA.find((d) => d.name === newDiv);
                          if (divObj && divObj.districts.length > 0) {
                            setDistrict(divObj.districts[0].name);
                            setUpazila(divObj.districts[0].upazilas[0] || '');
                          }
                        }}
                        className="w-full px-2 py-1.5 text-xs border rounded-lg bg-white"
                      >
                        {BANGLADESH_ADMINISTRATIVE_DATA.map((d) => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => {
                          const newDst = e.target.value;
                          setDistrict(newDst);
                          const dstObj = currentDivisionObj.districts.find((dst) => dst.name === newDst);
                          if (dstObj && dstObj.upazilas.length > 0) {
                            setUpazila(dstObj.upazilas[0]);
                          }
                        }}
                        className="w-full px-2 py-1.5 text-xs border rounded-lg bg-white"
                      >
                        {currentDivisionObj.districts.map((dst) => (
                          <option key={dst.name} value={dst.name}>{dst.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Upazila / Thana</label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border rounded-lg bg-white"
                      >
                        {currentDistrictObj.upazilas.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Area / Sector / Ward"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="px-3 py-2 text-xs border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code (e.g. 1209)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="px-3 py-2 text-xs border rounded-lg bg-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="House, Road, Block, House details..."
                    required
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <label htmlFor="isDefault" className="text-xs text-slate-700">Set as default delivery address</label>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed rounded-lg">
                  No delivery addresses saved yet. Click &quot;Add New Address&quot; above.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-slate-200 rounded-xl p-4 text-xs relative bg-white hover:border-emerald-500 transition">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="font-bold text-slate-800 text-sm mb-1">{addr.fullName}</div>
                      <div className="text-slate-600 font-mono mb-2">{addr.phone}</div>
                      <p className="text-slate-700 leading-relaxed">
                        {addr.detailedAddress}, {addr.area ? `${addr.area}, ` : ''}{addr.upazila}, {addr.district}, {addr.division} {addr.postalCode ? `(${addr.postalCode})` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ROLES */}
          {activeTab === 'roles' && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Unified Marketplace Roles</h2>
              <p className="text-xs text-slate-500 mb-6 pb-2 border-b border-slate-100">
                A single account allows you to operate as a Buyer, Seller, Affiliate, or Staff simultaneously.
              </p>

              <div className="space-y-4">
                {/* SELLER ROLE */}
                <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Merchant / Vendor Account</div>
                      <p className="text-xs text-slate-500">Sell products, fulfill orders, manage inventory and receive payouts</p>
                    </div>
                  </div>
                  {activeRoles.includes('SELLER') ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnableRole('SELLER')}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg"
                    >
                      Enable Vendor Mode
                    </button>
                  )}
                </div>

                {/* AFFILIATE ROLE */}
                <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 text-purple-800 p-2.5 rounded-lg">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Affiliate Partner Account</div>
                      <p className="text-xs text-slate-500">Promote products with unique referral links and earn sales commissions</p>
                    </div>
                  </div>
                  {activeRoles.includes('AFFILIATE') ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnableRole('AFFILIATE')}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg"
                    >
                      Enable Affiliate Mode
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
