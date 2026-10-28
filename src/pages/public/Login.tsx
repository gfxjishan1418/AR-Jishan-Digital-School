import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginProps {
  onSuccessLogin: () => void;
  onNavigateHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccessLogin, onNavigateHome }) => {
  const { login, switchRole, demoProfiles } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('ria.admin@arjishandigitalschool.edu.bd');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState<UserRole>('school_admin');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts: { role: UserRole; name: string; title: string; color: string }[] = [
    { role: 'school_admin', name: 'Ms. Ria', title: 'School Admin / Principal', color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' },
    { role: 'teacher', name: 'Dr. Rafiqul Islam', title: 'Senior Class Teacher', color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' },
    { role: 'student', name: 'Aarav Ahmed', title: 'Student (Class 10A)', color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30' },
    { role: 'parent', name: 'Tareq Ahmed', title: 'Parent / Guardian', color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' },
    { role: 'accountant', name: 'Mahmudul Hasan', title: 'Accounts & Bursar', color: 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30' },
    { role: 'super_admin', name: 'Tanvir Hossain', title: 'Platform Super Admin', color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' },
  ];

  const handleSelectDemo = (role: UserRole) => {
    setSelectedRole(role);
    const profile = demoProfiles[role];
    if (profile) {
      setEmail(profile.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, selectedRole);
    setIsLoading(false);
    onSuccessLogin();
  };

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
            Secure Role-Based Access for Students, Parents, Faculty & Administration
          </p>
        </div>

        {/* 1-Click Demo Profile Pills */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Quick Login As:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {demoAccounts.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleSelectDemo(item.role)}
                className={`p-2.5 rounded-xl border text-left transition-all ${item.color} ${
                  selectedRole === item.role
                    ? 'ring-2 ring-brand-600 font-bold shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{item.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                School Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {demoProfiles[selectedRole]?.name} Workspace
            </Button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by Supabase Auth & JWT Sessions</span>
            </span>
          </div>
        </Card>

      </div>
    </div>
  );
};
