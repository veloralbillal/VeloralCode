import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { parseFirebaseError } from '../../utils/helpers';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onNavigate: (route: string) => void;
  onOpenGuide?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onNavigate,
}) => {
  const { login, register, resetPassword, currentUser, isAdmin, isSeller, isCreator, userProfile, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode]);

  // If already authenticated and profile is fully loaded, route directly to the appropriate dashboard
  useEffect(() => {
    if (!authLoading && currentUser && userProfile) {
      if (isAdmin || userProfile.role === 'admin') {
        onNavigate('#/admin');
      } else if (isSeller || userProfile.role === 'seller') {
        onNavigate('#/seller');
      } else if (isCreator || userProfile.role === 'creator') {
        onNavigate('#/creator');
      } else {
        onNavigate('#/');
      }
    }
  }, [currentUser, authLoading, userProfile, isAdmin, isSeller, isCreator, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || (!password && mode !== 'forgot')) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email.trim(), password);
        if (result.success) {
          showToast(
            result.isAdmin
              ? '⚡ Welcome Admin! Direct access granted.'
              : result.isSeller || result.userRole === 'seller'
              ? '💼 Welcome Seller! Switched to your Reseller Portal.'
              : result.isCreator || result.userRole === 'creator'
              ? '🚀 Welcome Creator! Switched to your Creator Studio.'
              : '👋 Welcome back! Logged in successfully.',
            'success'
          );

          // Direct immediate navigation to the correct portal without any intermediate delay or screen jump
          if (result.isAdmin) {
            onNavigate('#/admin');
          } else if (result.isSeller || result.userRole === 'seller') {
            onNavigate('#/seller');
          } else if (result.isCreator || result.userRole === 'creator') {
            onNavigate('#/creator');
          } else {
            onNavigate('#/');
          }
        } else {
          setErrorMsg(parseFirebaseError(result.error));
        }
      } else if (mode === 'register') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const result = await register(email.trim(), password, name);
        if (result.success) {
          showToast('Account created successfully!', 'success');
          if (result.isAdmin) {
            onNavigate('#/admin');
          } else if (result.isSeller || result.userRole === 'seller') {
            onNavigate('#/seller');
          } else if (result.isCreator || result.userRole === 'creator') {
            onNavigate('#/creator');
          } else {
            onNavigate('#/');
          }
        } else {
          setErrorMsg(parseFirebaseError(result.error));
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email.trim());
        if (result.success) {
          setSuccessMsg('Password reset link sent! Check your email inbox.');
          showToast('Password reset link sent to your email.', 'info');
        } else {
          setErrorMsg(parseFirebaseError(result.error));
        }
      }
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-1">
              {mode === 'login' && <LogIn className="w-6 h-6" />}
              {mode === 'register' && <UserPlus className="w-6 h-6" />}
              {mode === 'forgot' && <KeyRound className="w-6 h-6" />}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === 'login' && 'Sign In to CodeToolkit'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {mode === 'login' && 'Access code library, templates and your portal dashboard'}
              {mode === 'register' && 'Join developers to browse and bookmark code snippets'}
              {mode === 'forgot' && 'Enter your email to receive a recovery link'}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Developer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Modes */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Register here
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your credentials?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Back to Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
