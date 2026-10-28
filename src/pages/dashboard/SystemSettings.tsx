import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSupabaseStatus } from '../../lib/supabase';
import { getFirebaseStatus } from '../../lib/firebase';
import { AIService } from '../../lib/aiService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Settings, Database, Sparkles, Building2, Shield, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Key, Flame 
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { school, updateSchool, allSchools, switchSchool } = useSchool();
  const { t } = useLanguage();
  const supabaseStatus = getSupabaseStatus();
  const firebaseStatus = getFirebaseStatus();

  const [name, setName] = useState(school.name);
  const [eiin, setEiin] = useState(school.eiinNumber);
  const [phone, setPhone] = useState(school.phone);
  const [email, setEmail] = useState(school.email);
  const [address, setAddress] = useState(school.address);
  const [board, setBoard] = useState(school.board);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name,
      eiinNumber: eiin,
      phone,
      email,
      address,
      board,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.systemSettings} & Multi-Tenant SaaS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school profile, multi-tenant database isolation, Supabase backend & AI engine
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleSaveProfile}
          icon={savedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
        >
          {savedFeedback ? 'Saved!' : 'Save School Profile'}
        </Button>
      </div>

      {/* Multi-Tenant School Switcher Banner */}
      <Card className="p-4 bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-brand-300 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-200">
                Multi-Tenant Architecture Active
              </p>
              <h3 className="font-extrabold text-base text-white">{school.name}</h3>
              <p className="text-xs text-slate-400">Tenant Code: {school.code} • Subdomain: {school.subdomain}.digitalaischool.edu.bd</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300 font-semibold">Switch Tenant:</label>
            <select
              value={school.id}
              onChange={(e) => switchSchool(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-800 text-white border border-slate-700 font-medium"
            >
              {allSchools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Backend & Security Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Supabase PostgreSQL Backend Status */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Supabase PostgreSQL</h3>
            </div>
            <Badge variant={supabaseStatus.isConfigured ? 'emerald' : 'blue'}>
              {supabaseStatus.isConfigured ? 'Connected (Live)' : 'Local Storage Engine'}
            </Badge>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            34 normalized relational tables with Row Level Security (RLS) for tenant isolation.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Endpoint:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{supabaseStatus.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-600 font-bold">{supabaseStatus.isConfigured ? 'Active' : 'Standby'}</span>
            </div>
          </div>
        </Card>

        {/* Firebase Cloud Suite Status */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Firebase Suite</h3>
            </div>
            <Badge variant={firebaseStatus.isConfigured ? 'emerald' : 'amber'}>
              {firebaseStatus.isConfigured ? 'Connected (Live)' : 'Standby (.env ready)'}
            </Badge>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Realtime Firestore Sync, Firebase Auth, and Storage for document attachments.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Project ID:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{firebaseStatus.projectId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Auth Domain:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{firebaseStatus.authDomain}</span>
            </div>
          </div>
        </Card>

        {/* AI Engine Status */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Intelligence Module</h3>
            </div>
            <Badge variant="emerald">
              {AIService.isConfigured() ? 'Gemini 1.5 Flash Live' : 'Education Engine Active'}
            </Badge>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Powers Lesson Planner, Quiz Generator, 24/7 AI Tutor & Defaulter Predictor.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Provider:</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">Gemini / Local NCTB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bilingual:</span>
              <span className="text-brand-600 font-bold">English & বাংলা</span>
            </div>
          </div>
        </Card>

      </div>

      {/* School Profile Edit Form */}
      <Card className="p-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
          Institute Profile & Branding Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Institute Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">EIIN Number (Bangladesh)</label>
              <input
                type="text"
                required
                value={eiin}
                onChange={(e) => setEiin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Education Board</label>
              <input
                type="text"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary">
              Update Profile Information
            </Button>
          </div>
        </form>
      </Card>

    </div>
  );
};
