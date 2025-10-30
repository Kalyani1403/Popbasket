import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircleIcon, UserCircleIcon } from './icons';

interface SignupViewProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
  });

  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
    });
  }, [password]);

  const allValidationsMet = passwordValidation.length && passwordValidation.hasNumber && passwordValidation.hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name) return setError('Please enter your full name.');
    if (!email) return setError('Please enter your email.');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!allValidationsMet) {
      setError('Password does not meet all requirements.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      onSignupSuccess();
    } catch (err: any) {
      setError(err?.message || 'Unable to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationChecklistItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      <CheckCircleIcon className={`w-4 h-4 mr-2 transition-colors ${isValid ? 'text-green-500' : 'text-gray-300'}`} />
      {text}
    </li>
  );

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Create a new account</h2>
            <div className="p-2 rounded-full bg-indigo-50">
              <UserCircleIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name-signup" className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                id="name-signup"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email-address-signup" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email-address-signup"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  id="password-signup"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                id="confirm-password-signup"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <ul className="space-y-1 mt-2 pl-1">
              <ValidationChecklistItem isValid={passwordValidation.length} text="At least 8 characters long" />
              <ValidationChecklistItem isValid={passwordValidation.hasLetter} text="Contains at least one letter" />
              <ValidationChecklistItem isValid={passwordValidation.hasNumber} text="Contains at least one number" />
            </ul>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading || !allValidationsMet || !confirmPassword || !name}
                className="w-full inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:opacity-95 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-indigo-600 font-medium hover:underline">Sign in</button>
          </p>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="bg-white bg-opacity-10 rounded-full p-4 mb-6">
            <UserCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Join PopBasket</h3>
          <p className="mt-2 text-indigo-100 text-center max-w-xs">Create an account to save your wishlist, track orders, and checkout faster.</p>
          <div className="mt-6 w-full">
            <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-full text-white text-sm font-medium transition">Learn more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupView;