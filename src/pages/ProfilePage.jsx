// My Profile — edit account details, password and saved addresses (all stored in MongoDB)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Pencil, Trash2, Plus, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatAddress } from '../utils/orderFormat';
import './AccountPage.css';
import './ProfilePage.css';

const EMPTY_ADDRESS = {
  label: 'Home', name: '', phone: '', flatNo: '', floor: '', building: '',
  address: '', landmark: '', pincode: '', city: '', state: '', isDefault: false,
};

export default function ProfilePage() {
  const { user, authReady, updateProfile, addresses, refreshAddresses, showToast } = useApp();

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [editingId, setEditingId] = useState(null); // null = closed, 'new' = add form, id = editing
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [addressError, setAddressError] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingAddresses(true);
    refreshAddresses()
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoadingAddresses(false));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!authReady) {
    return <div className="account-page"><div className="container"><p className="sn-state-msg">Loading your profile...</p></div></div>;
  }

  if (!user) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="sn-state-msg" style={{ marginTop: 48 }}>
            <h2 style={{ marginBottom: 8 }}>Please log in to view your profile</h2>
            <Link to="/account" state={{ from: '/profile' }} className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const phone = profile.phone.replace(/\D/g, '').slice(-10);
    if (profile.name.trim().length < 2) return setProfileError('Please enter your full name');
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) return setProfileError('Please enter a valid email address');
    if (profile.phone && !/^[6-9]\d{9}$/.test(phone)) return setProfileError('Please enter a valid 10-digit mobile number');
    setProfileError('');
    setSavingProfile(true);
    try {
      await updateProfile({ name: profile.name.trim(), email: profile.email.trim() || undefined, phone: phone || undefined });
      showToast('Profile updated', 'success');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) return setPasswordError('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirm) return setPasswordError('Passwords do not match');
    setPasswordError('');
    setSavingPassword(true);
    try {
      await api.auth.changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      showToast('Password updated', 'success');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const openNewAddress = () => {
    setAddressForm({ ...EMPTY_ADDRESS, name: user.name || '', phone: user.phone || '' });
    setAddressError('');
    setEditingId('new');
  };

  const openEditAddress = (a) => {
    setAddressForm({ ...EMPTY_ADDRESS, ...a });
    setAddressError('');
    setEditingId(a.id);
  };

  const setAddr = (field) => (e) => setAddressForm({ ...addressForm, [field]: e.target.value });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const a = addressForm;
    const phone = a.phone.replace(/\D/g, '').slice(-10);
    if (a.name.trim().length < 2) return setAddressError("Please enter the receiver's name");
    if (!/^[6-9]\d{9}$/.test(phone)) return setAddressError('Please enter a valid 10-digit mobile number');
    if (a.address.trim().length < 3) return setAddressError('Please enter the address (area, street)');
    if (!/^\d{6}$/.test(a.pincode.trim())) return setAddressError('Pincode must be 6 digits');
    if (!a.city.trim() || !a.state.trim()) return setAddressError('Please enter the city and state');
    setAddressError('');
    setSavingAddress(true);
    const payload = {
      label: a.label, name: a.name.trim(), phone, flatNo: a.flatNo, floor: a.floor, building: a.building,
      address: a.address.trim(), landmark: a.landmark, pincode: a.pincode.trim(), city: a.city.trim(),
      state: a.state.trim(), isDefault: !!a.isDefault,
    };
    try {
      if (editingId === 'new') await api.addresses.create(payload);
      else await api.addresses.update(editingId, payload);
      await refreshAddresses();
      showToast(editingId === 'new' ? 'Address added' : 'Address updated', 'success');
      setEditingId(null);
    } catch (err) {
      setAddressError(err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (a) => {
    if (busyId) return;
    if (!window.confirm(`Delete this ${a.label} address?`)) return;
    setBusyId(a.id);
    try {
      await api.addresses.remove(a.id);
      await refreshAddresses();
      if (editingId === a.id) setEditingId(null);
      showToast('Address deleted', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleMakeDefault = async (a) => {
    setBusyId(a.id);
    try {
      await api.addresses.setDefault(a.id);
      await refreshAddresses();
      showToast('Default address updated', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="account-page profile-page">
      <div className="container">
        <div className="orders-breadcrumbs" style={{ marginTop: 24, marginBottom: 24 }}>
          <Link to="/">Home</Link> <ChevronRight size={14}/> <Link to="/account">My Account</Link> <ChevronRight size={14}/> <span>My Profile</span>
        </div>

        <div className="profile-grid">
          {/* Account details */}
          <section className="profile-card">
            <h2 className="profile-card-title">Personal Details</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              {profileError && <p className="sn-form-error">{profileError}</p>}
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</button>
            </form>

            <h2 className="profile-card-title" style={{ marginTop: 36 }}>Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Leave blank if you signed up with OTP" autoComplete="current-password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="At least 6 characters" autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} autoComplete="new-password" />
              </div>
              {passwordError && <p className="sn-form-error">{passwordError}</p>}
              <button type="submit" className="btn btn-outline" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Update Password'}</button>
            </form>
          </section>

          {/* Addresses */}
          <section className="profile-card">
            <div className="profile-card-head">
              <h2 className="profile-card-title">Saved Addresses</h2>
              {editingId === null && (
                <button type="button" className="btn btn-outline btn-sm" onClick={openNewAddress}><Plus size={14} /> Add New</button>
              )}
            </div>

            {editingId !== null && (
              <form className="profile-address-form" onSubmit={handleSaveAddress}>
                <div className="profile-row-2">
                  <div className="form-group">
                    <label className="form-label">Flat / House No.</label>
                    <input className="form-input" value={addressForm.flatNo} onChange={setAddr('flatNo')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Floor</label>
                    <input className="form-input" value={addressForm.floor} onChange={setAddr('floor')} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Building Name</label>
                  <input className="form-input" value={addressForm.building} onChange={setAddr('building')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Area, Street *</label>
                  <textarea className="form-input" rows={2} value={addressForm.address} onChange={setAddr('address')} style={{ resize: 'vertical' }} />
                </div>
                <div className="profile-row-2">
                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input className="form-input" value={addressForm.landmark} onChange={setAddr('landmark')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" maxLength={6} inputMode="numeric" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })} />
                  </div>
                </div>
                <div className="profile-row-2">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" value={addressForm.city} onChange={setAddr('city')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input className="form-input" value={addressForm.state} onChange={setAddr('state')} />
                  </div>
                </div>
                <div className="profile-row-2">
                  <div className="form-group">
                    <label className="form-label">Receiver's Name *</label>
                    <input className="form-input" value={addressForm.name} onChange={setAddr('name')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Receiver's Phone *</label>
                    <input className="form-input" type="tel" maxLength={10} value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Save as</label>
                  <div className="profile-tags">
                    {['Home', 'Work', 'Other'].map((label) => (
                      <button type="button" key={label} className={`profile-tag ${addressForm.label === label ? 'active' : ''}`} onClick={() => setAddressForm({ ...addressForm, label })}>{label}</button>
                    ))}
                  </div>
                </div>
                <label className="profile-check">
                  <input type="checkbox" checked={!!addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                  Make this my default address
                </label>
                {addressError && <p className="sn-form-error">{addressError}</p>}
                <div className="profile-actions">
                  <button type="submit" className="btn btn-primary" disabled={savingAddress}>{savingAddress ? 'Saving...' : editingId === 'new' ? 'Save Address' : 'Update Address'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            )}

            {loadingAddresses && addresses.length === 0 && <p className="sn-state-msg">Loading addresses...</p>}
            {!loadingAddresses && addresses.length === 0 && editingId === null && (
              <p className="sn-state-msg">No saved addresses yet. Add one for faster checkout.</p>
            )}

            <div className="profile-address-list">
              {addresses.map((a) => (
                <div key={a.id} className={`profile-address ${a.isDefault ? 'is-default' : ''}`}>
                  <div className="profile-address-top">
                    <span className="profile-address-label"><MapPin size={14} /> {a.label}</span>
                    {a.isDefault && <span className="profile-default-badge">Default</span>}
                  </div>
                  <p className="profile-address-name">{a.name} · +91 {a.phone}</p>
                  <p className="profile-address-text">{formatAddress(a)}</p>
                  <div className="profile-address-actions">
                    <button type="button" onClick={() => openEditAddress(a)} disabled={busyId === a.id}><Pencil size={14} /> Edit</button>
                    {!a.isDefault && (
                      <button type="button" onClick={() => handleMakeDefault(a)} disabled={busyId === a.id}><Star size={14} /> Set default</button>
                    )}
                    <button type="button" className="danger" onClick={() => handleDeleteAddress(a)} disabled={busyId === a.id}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
