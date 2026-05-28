import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  Settings, 
  User, 
  Building, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Eye,
  Settings2
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateUserProfile, theme, setTheme } = useSyncrix();

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
    <div id="settings-page" className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Upper header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-accent-dark tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Customize your freelance workspace theme, profile, and account credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar column */}
        <div className="space-y-3">
          <div className="bg-white p-5 shadow-panel space-y-2 hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '24px' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 select-none pb-1 border-b border-gray-100">
              Workspace Core
            </h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-primary-light text-primary flex items-center gap-2">
                <User size={14} />
                <span>Profile & Brand</span>
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('pass-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Lock size={14} />
                <span>Security Settings</span>
              </button>
            </div>
          </div>

          <div className="bg-[#253D2C] p-4 rounded-xl text-white space-y-3">
            <div className="flex items-center gap-1.5 text-secondary">
              <Sparkles size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">Syncrix Growth Badge</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-300 font-medium">
              Registered workspace data and configurations sync instantly directly with client-side secure localStorage keys.
            </p>
            <div className="flex gap-2 text-[10px] text-gray-300 border-t border-[#2e4c37] pt-2">
              <Clock size={12} className="shrink-0" />
              <span>Registered: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Configurations column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Profile Profile */}
          <section className="bg-white p-6 shadow-panel space-y-4 hover:scale-[1.002] transition-all duration-300" style={{ borderRadius: '32px' }}>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <User size={18} className="text-primary" />
              <h3 className="font-display font-bold text-accent-dark">Profile & Trade Name</h3>
            </div>

            {profileSuccess && (
              <div id="profile-success" className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  id="settings-name-field"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-accent-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Freelance Agency / Company Trade Name
                </label>
                <input
                  id="settings-company-field"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Rivera Creative"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-accent-dark"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="save-profile-btn"
                  type="submit"
                  className="px-4 py-2 bg-primary rounded-xl text-xs font-bold text-white hover:bg-[#20512f] active:scale-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
                >
                  Save Profile Configuration
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: Theme Settings */}
          <section className="bg-white p-6 shadow-panel space-y-4 hover:scale-[1.002] transition-all duration-300" style={{ borderRadius: '32px' }}>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Sparkles size={18} className="text-secondary" />
              <h3 className="font-display font-bold text-accent-dark">Appearance Preferences</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Option 1: Light Theme */}
              <button
                id="theme-light-btn"
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between h-24 transition-all
                  ${theme === 'light' 
                    ? 'border-primary bg-primary-light/10 shadow-sm font-semibold' 
                    : 'border-gray-100 hover:border-gray-200'}`}
              >
                <span className="text-xs font-bold text-emerald-800">Syncrix Mint Light</span>
                <p className="text-[10px] text-gray-400 font-medium">Eye-safe cream colors with crisp shadows</p>
              </button>

              {/* Option 2: Mint Slate Theme */}
              <button
                id="theme-slate-btn"
                type="button"
                onClick={() => setTheme('mint-slate')}
                className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between h-24 transition-all
                  ${theme === 'mint-slate' 
                    ? 'border-secondary bg-primary-light/20 shadow-sm font-semibold' 
                    : 'border-gray-100 hover:border-gray-200'}`}
              >
                <span className="text-xs font-bold text-accent-dark">Deep Slate Accent</span>
                <p className="text-[10px] text-gray-400 font-medium">Extra high contrast panels for coding/writing</p>
              </button>
            </div>
          </section>

          {/* Section 3: Change Password */}
          <section id="pass-section" className="bg-white p-6 shadow-panel space-y-4 hover:scale-[1.002] transition-all duration-300" style={{ borderRadius: '32px' }}>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Lock size={18} className="text-red-500" />
              <h3 className="font-display font-bold text-accent-dark">Account Security</h3>
            </div>

            {passwordError && (
              <div id="password-error" className="bg-red-50 border border-red-105 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div id="password-success" className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  id="current-password-field"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    New Secure Password
                  </label>
                  <input
                    id="new-password-field"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password-field"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="save-password-btn"
                  type="submit"
                  className="px-4 py-2 border border-[#2E6F40]/20 text-xs font-bold text-primary bg-primary-light hover:bg-[#b5eecc] active:scale-95 rounded-xl transition-all cursor-pointer"
                >
                  Modify Access Password
                </button>
              </div>
            </form>
          </section>

        </div>

      </div>

    </div>
  );
}
