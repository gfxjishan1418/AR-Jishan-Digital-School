import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldAlert, ShieldCheck, RefreshCw, LogOut, ArrowLeft, Terminal, Copy, Check } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  onRedirectLogin: () => void;
  onRedirectHome: () => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  onRedirectLogin,
  onRedirectHome,
}) => {
  const { user, isAdmin, isLoading, authProviderType, refreshSession, logout } = useAuth();
  const { isBangla } = useLanguage();
  const [isCopied, setIsCopied] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="relative">
            <img
              src="/logo.png"
              alt="AR Jishan Digital School & College"
              className="w-16 h-16 rounded-2xl object-contain bg-white p-1 ring-2 ring-brand-500 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBangla ? 'অ্যাডমিন সেশন ও সিকিউরিটি যাচাই করা হচ্ছে...' : 'Verifying Administrator Session...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBangla 
                ? 'ফায়ারবেস ক্রিপ্টোগ্রাফিক টোকেন ও কাস্টম ক্লেইমস যাচাই করা হচ্ছে' 
                : 'Validating Firebase cryptographically signed custom claims'}
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-brand-600 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthorized State: Authenticated in Firebase, but missing Admin Custom Claim
  if (authProviderType === 'firebase' && !isAdmin) {
    const cliCommand = `node scripts/set-admin-claim.cjs set "${user.email}" school_admin`;

    const handleCopy = () => {
      navigator.clipboard.writeText(cliCommand);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRefresh = async () => {
      setIsRefreshing(true);
      await refreshSession();
      setIsRefreshing(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100/70 dark:bg-slate-950 px-4 py-12">
        <Card className="max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-rose-200 dark:border-rose-900/50">
          
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 ring-4 ring-rose-50 dark:ring-rose-950/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                Security Enforced • Access Restricted
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isBangla ? 'অ্যাডমিন প্রিভিলেজ প্রয়োজন' : 'Administrator Privileges Required'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBangla
                  ? 'আপনার অ্যাকাউন্টটি ফায়ারবেসে সফলভাবে অথেন্টিকেট হয়েছে, কিন্তু এটিতে কোনো অনুমোদিত অ্যাডমিন ক্লেইম নেই।'
                  : 'Your account is verified by Firebase Auth, but does not possess verified administrator custom claims.'}
              </p>
            </div>
          </div>

          {/* User Details Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Authenticated Email:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{user.email}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Firebase UID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[240px]">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Custom Claim Status:</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">admin: false (Missing)</span>
            </div>
          </div>

          {/* Secure Server-Side Process Guide */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBangla ? 'সার্ভার-সাইড অ্যাডমিন ক্লেইম অ্যাসাইন প্রক্রিয়া:' : 'Server-Side Admin Claim Assignment Command:'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isBangla 
                ? 'নিরাপত্তার স্বার্থে ব্রাউজার বা ক্লায়েন্ট সাইড থেকে রোল পরিবর্তন করা অসম্ভব। সিস্টেম অপারেটরকে টার্মিনালে নিচের কমান্ডটি চালাতে হবে:'
                : 'Client-side privilege escalation is strictly prevented. The system operator must grant privileges using the server CLI:'}
            </p>

            <div className="relative group">
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 select-all">
                {cliCommand}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-2 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {isBangla ? 'ক্লেইমস রিফ্রেশ করুন' : 'Refresh Token & Verify'}
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRedirectHome}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                {isBangla ? 'হোমে ফিরুন' : 'Back to Home'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await logout();
                  onRedirectLogin();
                }}
                icon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
              >
                {isBangla ? 'অন্য একাউন্টে লগইন' : 'Switch Account'}
              </Button>
            </div>
          </div>

        </Card>
      </div>
    );
  }

  // 3. Authorized Admin: Render Dashboard
  return <>{children}</>;
};
