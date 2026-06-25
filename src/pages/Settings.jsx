import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  User, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateUserProfile } = useSyncrix();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

  // Profile fields state
  const [name, setName] = useState(currentUser?.name || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handle Profile Update
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name || !company) {
      setProfileSuccess('');
      alert('Name and Company cannot be left blank.');
      return;
    }

    updateUserProfile({ name, company });
    setProfileSuccess('Your profile settings were successfully updated!');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  // Handle Password Change Simulation
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all requested password fields.');
      return;
    }

    if (currentPassword !== currentUser?.password) {
      setPasswordError('Your current password does not match our records.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and password confirmation do not match.');
      return;
    }

    // Save
    updateUserProfile({ password: newPassword });
    setPasswordSuccess('Password secured! Your login credentials have been updated.');
    
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div id="settings-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Upper header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-accent-dark tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Customize your freelance workspace profile and account credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Workspace Core Navigation Card */}
          <div className="bg-white p-5 shadow-panel space-y-3" style={{ borderRadius: '24px' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 select-none pb-2 border-b border-gray-100">
              Workspace Core
            </h3>
            <div className="space-y-1.5">
              <button 
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-primary-light text-primary border-l-4 border-primary shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-accent-dark'
                }`}
              >
                <User size={15} />
                <span>Profile & Brand</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-primary-light text-primary border-l-4 border-primary shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-accent-dark'
                }`}
              >
                <Lock size={15} />
                <span>Account Security</span>
              </button>
            </div>
          </div>

          {/* Syncrix Growth Badge Card */}
          <div className="bg-gradient-to-br from-[#253D2C] via-[#1E3325] to-[#122117] p-6 shadow-xl text-white space-y-4 border border-white/5 relative overflow-hidden" style={{ borderRadius: '24px' }}>
            {/* Subtle decorative glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-secondary">
              <Sparkles size={16} className="text-[#68BA7F] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-[#68BA7F]">Workspace Sync</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200/90 font-medium">
              Registered workspace data and configurations sync instantly directly with client-side secure localStorage keys.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-350 border-t border-white/10 pt-3">
              <Clock size={12} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-300">Registered: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Configurations column */}
        <div className="lg:col-span-3">
          
          {/* Section 1: Profile Profile */}
          {activeTab === 'profile' && (
            <section className="bg-white p-8 sm:p-10 shadow-panel space-y-6 transition-all duration-300 w-full" style={{ borderRadius: '32px' }}>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-150/60">
                <div className="p-2 rounded-xl bg-primary-light text-primary">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-accent-dark">Profile & Trade Name</h3>
                  <p className="text-xs text-gray-400 font-medium">Update your branding and freelance identity</p>
                </div>
              </div>

              {profileSuccess && (
                <div id="profile-success" className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-accent-dark/70 uppercase tracking-widest mb-2">
                    Your Full Name
                  </label>
                  <input
                    id="settings-name-field"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-accent-dark bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-accent-dark/70 uppercase tracking-widest mb-2">
                    Freelance Agency / Company Trade Name
                  </label>
                  <input
                    id="settings-company-field"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Rivera Creative"
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-accent-dark bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="save-profile-btn"
                    type="submit"
                    className="px-5 py-2.5 bg-primary rounded-xl text-xs font-bold text-white hover:bg-[#20512f] active:scale-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
                  >
                    Save Profile Configuration
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Section 2: Change Password */}
          {activeTab === 'security' && (
            <section id="pass-section" className="bg-white p-8 sm:p-10 shadow-panel space-y-6 transition-all duration-300 w-full" style={{ borderRadius: '32px' }}>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-150/60">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-accent-dark">Account Security</h3>
                  <p className="text-xs text-gray-400 font-medium">Manage your access password and security credentials</p>
                </div>
              </div>

              {passwordError && (
                <div id="password-error" className="bg-red-50 border border-red-100 text-red-700 text-xs p-3.5 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div id="password-success" className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-accent-dark/70 uppercase tracking-widest mb-2">
                    Current Password
                  </label>
                  <input
                    id="current-password-field"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium bg-gray-50/50 focus:bg-white text-accent-dark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-accent-dark/70 uppercase tracking-widest mb-2">
                      New Secure Password
                    </label>
                    <input
                      id="new-password-field"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium bg-gray-50/50 focus:bg-white text-accent-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-accent-dark/70 uppercase tracking-widest mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password-field"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium bg-gray-50/50 focus:bg-white text-accent-dark"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="save-password-btn"
                    type="submit"
                    className="px-5 py-2.5 border border-[#2E6F40]/25 text-xs font-bold text-primary bg-primary-light hover:bg-[#b5eecc] active:scale-95 rounded-xl transition-all cursor-pointer"
                  >
                    Modify Access Password
                  </button>
                </div>
              </form>
            </section>
          )}

        </div>

      </div>

    </div>
  );
}
