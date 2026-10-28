import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { isFirebaseConfigured, getFirebaseStatus } from '../../lib/firebase';
import { UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Sparkles, 
  Eye, EyeOff, AlertCircle, KeyRound, Server 
} from 'lucide-react';

interface LoginProps {
  onSuccessLogin: () => void;
  onNavigateHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccessLogin, onNavigateHome }) => {
  const { loginWithFirebase, loginDemo, demoProfiles, authError, clearAuthError } = useAuth();
  const { isBangla } = useLanguage();
  const firebaseStatus = getFirebaseStatus();

  // Mode: 'firebase' for real admin authentication, 'demo' for preview accounts
  const [authMode, setAuthMode] = useState<'firebase' | 'demo'>(
    isFirebaseConfigured ? 'firebase' : 'demo'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('school_admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const demoAccounts: { role: UserRole; name: string; title: string; color: string }[] = [
    { role: 'school_admin', name: 'Ms. Ria', title: 'School Admin / Principal', color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' },
    { role: 'super_admin', name: 'Tanvir Hossain', title: 'Platform Super Admin', color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' },
    { role: 'teacher', name: 'Dr. Rafiqul Islam', title: 'Senior Class Teacher', color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' },
    { role: 'student', name: 'Aarav Ahmed', title: 'Student (Class 10A)', color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30' },
    { role: 'parent', name: 'Tareq Ahmed', title: 'Parent / Guardian', color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' },
    { role: 'accountant', name: 'Mahmudul Hasan', title: 'Accounts & Bursar', color: 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30' },
  ];

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email || !password) {
      setLocalError(isBangla ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড লিখুন।' : 'Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithFirebase(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      // Successfully authenticated
      onSuccessLogin();
    } else {
      setLocalError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginDemo(role);
    onSuccessLogin();
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={onNavigateHome}
            className="inline-flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="AR Jishan Digital School & College"
              className="w-16 h-16 rounded-2xl object-contain bg-white p-1 ring-2 ring-brand-500/50 group-hover:scale-105 transition-transform shadow-md"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            AR Jishan Digital School & College
          </h2>
          <p className="text-xs text-slate-500">
            {isBangla 
              ? 'নিরাপদ ফায়ারবেস অ্যাডমিন অথেনটিকেশন ও কাস্টম ক্লেইমস সিকিউরিটি'
              : 'Secure Firebase Admin Authentication & Custom Claims Authorization'}
          </p>
        </div>

        {/* Auth Mode Switcher Tab */}
        <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 flex items-center text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('firebase');
              setLocalError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'firebase'
                ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-brand-600" />
            <span>{isBangla ? 'ফায়ারবেস অ্যাডমিন লগইন' : 'Firebase Admin Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('demo');
              setLocalError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'demo'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isBangla ? 'ডেমো অ্যাকাউন্টস' : 'Demo Workspace'}</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {displayError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold">{displayError}</p>
              {displayError.includes('custom claims') && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  Tip: Run <code className="bg-rose-100 dark:bg-rose-900/60 px-1 py-0.5 rounded font-mono">node scripts/set-admin-claim.cjs set "{email}" school_admin</code> on your server.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Mode 1: Firebase Email & Password Form */}
        {authMode === 'firebase' && (
          <Card className="p-6 shadow-xl border border-slate-200/90 dark:border-slate-800">
            <form onSubmit={handleFirebaseLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {isBangla ? 'অ্যাডমিন ইমেইল এড্রেস *' : 'Administrator Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@arjishandigitalschool.edu.bd"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    {isBangla ? 'পাসওয়ার্ড *' : 'Password *'}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                  <span>Server Claims Enforced</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {firebaseStatus.isConfigured ? 'Firebase Connected' : 'Demo Setup'}
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md py-3 text-xs font-bold"
                isLoading={isSubmitting}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isBangla ? 'নিরাপদ অ্যাডমিন সাইন ইন' : 'Secure Admin Sign In'}
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Firebase Auth & Server-Side Claims</span>
              </span>
            </div>
          </Card>
        )}

        {/* Mode 2: Quick Demo Workspace Profiles */}
        {authMode === 'demo' && (
          <Card className="p-6 space-y-4 shadow-xl border border-slate-200/90 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {isBangla ? '১-ক্লিকে ডেমো রোল পরীক্ষা করুন:' : 'One-Click Instant Role Simulation:'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isBangla 
                  ? 'বিভিন্ন ব্যবহারকারী ও অনুষদের ইন্টারফেস অভিজ্ঞতা নিতে নিচের যেকোনোটিতে ক্লিক করুন' 
                  : 'Select any role to test dashboard navigation, permissions and workflows'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoAccounts.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleDemoLogin(item.role)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${item.color} hover:scale-[1.02] shadow-2xs`}
                >
                  <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.title}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Server className="w-3 h-3 text-slate-400" />
                <span>Demo sandbox mode does not require Firebase Admin credentials</span>
              </span>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};
