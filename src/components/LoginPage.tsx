import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Key, UserPlus, Compass, Building2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { signUp, signIn } from '../lib/auth';

type LoginMode = 'select' | 'member' | 'nuanu-team' | 'manager-select' | 'manager-experience' | 'manager-stay' | 'manager-delicious' | 'guide' | 'register';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<LoginMode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { user } = await signUp(email, password);
        if (!user) throw new Error('Registration failed');

        const userData = {
          id: user.id,
          name: name || email.split('@')[0],
          email,
          role: 'member'
        };

        login(userData);
        navigate('/member/dashboard');
      } else {
        // For test accounts, set the email based on the mode
        const testEmail = {
          'manager-experience': 'experience@nuanu.com',
          'manager-stay': 'stay@nuanu.com',
          'manager-delicious': 'delicious@nuanu.com',
          'guide': 'guide@nuanu.com'
        }[mode];

        const { user } = await signIn(testEmail || email, password);
        if (!user) throw new Error('Login failed');

        const role = user.user_metadata?.role || 'member';
        const managerType = user.user_metadata?.managerType;

        const userData = {
          id: user.id,
          name: user.user_metadata?.name || email.split('@')[0],
          email: testEmail || email,
          role,
          managerType
        };

        login(userData);

        switch (role) {
          case 'admin':
            navigate('/admin/workers');
            break;
          case 'guide':
            navigate('/guide/dashboard');
            break;
          case 'member':
            navigate('/member/dashboard');
            break;
          case 'manager':
            navigate('/manager/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Nuanu</h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'select' && "Choose how you'd like to continue"}
            {mode === 'member' && "Login to your account"}
            {mode === 'nuanu-team' && "Nuanu Team Login"}
            {mode === 'manager-select' && "Select Manager Type"}
            {mode === 'manager-experience' && "Experience Manager Login"}
            {mode === 'manager-stay' && "Stay Manager Login"}
            {mode === 'manager-delicious' && "Delicious Manager Login"}
            {mode === 'guide' && "Guide Login"}
            {mode === 'register' && "Create your account"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {mode === 'select' ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('register')}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nuanu hover:bg-nuanu-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register a Member
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={() => setMode('member')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <Key className="w-5 h-5 mr-2" />
              Login as Member
            </button>

            <button
              onClick={() => setMode('nuanu-team')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <Users className="w-5 h-5 mr-2" />
              Nuanu Team
            </button>
          </div>
        ) : mode === 'nuanu-team' ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('manager-experience')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <Users className="w-5 h-5 mr-2" />
              Experience Manager
            </button>

            <button
              onClick={() => setMode('manager-stay')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Stay Manager
            </button>

            <button
              onClick={() => setMode('manager-delicious')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Delicious Manager
            </button>

            <button
              onClick={() => setMode('guide')}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu"
            >
              <Compass className="w-5 h-5 mr-2" />
              Guide
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="text-sm text-nuanu hover:text-nuanu-light"
              >
                Back to options
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nuanu focus:border-nuanu focus:z-10 sm:text-sm mb-4"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nuanu focus:border-nuanu focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nuanu focus:border-nuanu focus:z-10 sm:text-sm mt-4"
                placeholder="Password"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nuanu focus:border-nuanu focus:z-10 sm:text-sm mt-4"
                  placeholder="Confirm Password"
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nuanu hover:bg-nuanu-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nuanu ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : mode === 'register' ? (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="text-sm text-nuanu hover:text-nuanu-light"
              >
                Back to options
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}