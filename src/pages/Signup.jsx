import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSyncrix } from '../context/SyncrixContext';
import { Mail, Lock, User, Briefcase, AlertCircle, Check } from 'lucide-react';

export default function Signup() {
  const { signup } = useSyncrix();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !company || !password) {
      setError('Please fill in all requested fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the privacy policy & workspace terms.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = signup(name, email, company, password);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    }, 500);
  };

  return (
    <div id="signup-page" className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-accent-light">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-light text-primary font-bold text-lg">
          S
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-accent-dark">
          Syncrix<span className="text-secondary">.</span>
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-accent-dark tracking-tight">
            Create your CRM workspace
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Join Syncrix to track deals, contacts, and monthly revenue metrics
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-panel sm:px-10 hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '32px' }}>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-1.5">
                Company / Agency Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Briefcase size={18} />
                </div>
                <input
                  id="signup-company-input"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Rivera Creative"
                  className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@riveracreative.co"
                  className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="signup-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="agree-checkbox"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary transition-colors"
                />
              </div>
              <div className="ml-2.5 text-xs text-gray-500 font-medium">
                <label htmlFor="agree-checkbox" className="cursor-pointer">
                  I agree to the Syncrix <span className="text-primary font-semibold hover:underline">Terms of Service</span> and <span className="text-primary font-semibold hover:underline">Privacy Policy</span>.
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="signup-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-[0.99] disabled:opacity-75 transition-all shadow-md shadow-primary/10"
              >
                {loading ? 'Creating workspace...' : 'Register Workspace'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Already have a CRM workspace?{' '}
              <Link id="link-to-login" to="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
