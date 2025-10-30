import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginIcon, UserCircleIcon } from './icons';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');
    setIsLoading(true);
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot/reset password states
  const [mode, setMode] = useState<'login' | 'request' | 'reset' | 'done'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const API_BASE = (window.location.hostname === 'localhost') ? 'http://localhost:5000' : '';

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left - branding/illustration */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="bg-white bg-opacity-10 rounded-full p-4 mb-6">
            <UserCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Welcome back</h3>
          <p className="mt-2 text-indigo-100 text-center max-w-xs">Sign in to access your orders, wishlist, and account settings.</p>
          <div className="mt-6 w-full">
            <button onClick={() => window.location.href = '/'} className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-full text-white text-sm font-medium transition">Browse as guest</button>
          </div>
        </div>

        {/* Right - form */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Sign in to your account</h2>
            <div className="p-2 rounded-full bg-indigo-50">
              <LoginIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
                aria-required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your password"
                  aria-required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">Remember me</label>
              </div>
              <div>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setMode('request'); setInfoMessage(''); }} className="text-sm text-indigo-600 hover:underline">Forgot password?</button>
                )}
                {mode !== 'login' && (
                  <button type="button" onClick={() => { setMode('login'); setInfoMessage(''); }} className="text-sm text-gray-500 hover:underline">Back to sign in</button>
                )}
              </div>
            </div>

            {mode === 'login' && (
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:opacity-95 disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            )}

            {/* Forgot password request form */}
            {mode === 'request' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Enter your account email and we'll provide a reset token (demo).</p>
                <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2 border rounded-md" />
                <div className="flex gap-2">
                  <button type="button" onClick={async () => {
                    setError(''); setInfoMessage('');
                    if (!resetEmail) return setError('Please enter your email.');
                    try {
                      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resetEmail })
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setInfoMessage('If the email exists, a reset token was generated. For demo the token is shown below.');
                        if (data.resetToken) setResetToken(data.resetToken);
                        setMode('reset');
                      } else {
                        setError(data.message || 'Unable to request reset');
                      }
                    } catch (err: any) {
                      setError(err?.message || 'Unable to request reset');
                    }
                  }} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Send reset</button>
                  <button type="button" onClick={() => setMode('login')} className="px-4 py-2 border rounded-md">Cancel</button>
                </div>
                {infoMessage && <p className="text-sm text-green-600">{infoMessage}</p>}
              </div>
            )}

            {/* Reset password form */}
            {mode === 'reset' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Enter the reset token and a new password.</p>
                <input type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Reset token" className="w-full px-4 py-2 border rounded-md" />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-4 py-2 border rounded-md" />
                <div className="flex gap-2">
                  <button type="button" onClick={async () => {
                    setError(''); setInfoMessage('');
                    if (!resetToken || !newPassword) return setError('Please provide token and new password.');
                    try {
                      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: resetToken, password: newPassword })
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setInfoMessage('Password reset successful. You can now sign in.');
                        setMode('done');
                      } else {
                        setError(data.message || 'Unable to reset password');
                      }
                    } catch (err: any) {
                      setError(err?.message || 'Unable to reset password');
                    }
                  }} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Set new password</button>
                  <button type="button" onClick={() => setMode('login')} className="px-4 py-2 border rounded-md">Cancel</button>
                </div>
                {infoMessage && <p className="text-sm text-green-600">{infoMessage}</p>}
              </div>
            )}

            {mode === 'done' && (
              <div>
                <p className="text-sm text-green-600">Password reset was successful. Please sign in with your new password.</p>
              </div>
            )}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-indigo-600 font-medium hover:underline">Create account</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
