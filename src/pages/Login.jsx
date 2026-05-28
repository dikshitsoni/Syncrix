import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSyncrix } from '../context/SyncrixContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useSyncrix();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulated short block loading
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    }, 450);
  };

  const autofillDemo = () => {
    setEmail('demo@syncrix.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div id="login-page" className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-accent-light">
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
            Welcome back to Syncrix
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manage your clients, pipeline and keep syncing growth
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-accent-dark uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <button
                id="login-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-[0.99] disabled:opacity-75 transition-all shadow-md shadow-primary/10"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <button
              id="autofill-demo-btn"
              type="button"
              onClick={autofillDemo}
              className="w-full flex items-center justify-between py-2.5 px-4 border border-[#2E6F40]/20 rounded-xl text-xs font-semibold text-primary bg-primary-light hover:bg-[#bceecb] focus:outline-none active:scale-[0.99] transition-all"
            >
              <span>Explore as Guest (Demo Account)</span>
              <div className="flex items-center gap-1">
                <span>Auto-fill</span>
                <ArrowRight size={14} />
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New to Syncrix?{' '}
              <Link id="link-to-signup" to="/signup" className="font-semibold text-primary hover:underline">
                Register a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
