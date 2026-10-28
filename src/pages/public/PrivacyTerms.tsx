import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyTerms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-xs sm:text-sm">
      
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">Compliance & Governance</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: May 2026 • Digital AI School Multi-Tenant Security Standard
        </p>
      </div>

      <Card className="p-8 space-y-6 leading-relaxed text-slate-700 dark:text-slate-300">
        
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            1. Student Data Privacy & Isolation
          </h2>
          <p>
            Digital AI School strictly enforces PostgreSQL Row Level Security (RLS) across all multi-tenant structures. Student educational records, attendance logs, and marks cannot be enumerated or accessed across different schools or unauthorized user accounts. Parents can only access records strictly linked to their verified ward.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600" />
            2. AI Safety & Student Protection
          </h2>
          <p>
            Our Nova AI Assistant module does not transmit sensitive student personal identification, phone numbers, or residential addresses to third-party language models. AI suggestions (lesson plans, practice quizzes, study tips) serve purely as formative tools and do not unilaterally alter official academic transcripts or financial balances.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-600" />
            3. Financial Transactions & Receipt Security
          </h2>
          <p>
            All fee payments settled via bKash, Nagad, Rocket, or Bank Transfer require server-side transaction validation. Official computer-generated receipts contain unique tracking codes and are stored immutably in accounting audit logs.
          </p>
        </div>

      </Card>

    </div>
  );
};
