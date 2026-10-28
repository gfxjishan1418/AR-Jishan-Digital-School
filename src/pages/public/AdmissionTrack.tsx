import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { AdmissionApplication } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Search, CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';

export const AdmissionTrack: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [appCode, setAppCode] = useState('APP-2026-8491');
  const [searchedApp, setSearchedApp] = useState<AdmissionApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const all = StorageService.getApplications();
    const found = all.find(a => a.applicationNo.toUpperCase().trim() === appCode.toUpperCase().trim());
    setSearchedApp(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <Badge variant="blue" size="md">Application Status Lookup</Badge>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Admission Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your unique Application Reference Number (e.g. <code>APP-2026-8491</code>)
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={appCode}
              onChange={(e) => setAppCode(e.target.value)}
              placeholder="Enter Application Code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm uppercase font-bold text-slate-900 dark:text-white"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Check Status
          </Button>
        </form>
      </Card>

      {hasSearched && (
        searchedApp ? (
          <Card className="p-6 space-y-4 border-l-4 border-l-brand-600 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-slate-400 font-bold">{searchedApp.applicationNo}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{searchedApp.applicantName}</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{searchedApp.applyingClass}</p>
              </div>
              <Badge 
                variant={searchedApp.status === 'Approved' || searchedApp.status === 'Enrolled' ? 'emerald' : searchedApp.status === 'Interview Scheduled' ? 'blue' : 'amber'}
                size="md"
              >
                {searchedApp.status}
              </Badge>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <p><span className="text-slate-500">Guardian:</span> <strong>{searchedApp.guardianName}</strong></p>
              <p><span className="text-slate-500">Contact:</span> <span className="font-mono">{searchedApp.guardianPhone}</span></p>
              <p><span className="text-slate-500">Submission Date:</span> <span>{searchedApp.appliedDate}</span></p>
              {searchedApp.status === 'Interview Scheduled' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 mt-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Interview & Assessment Scheduled:
                  </p>
                  <p className="mt-1 text-[11px]">
                    Saturday at 10:00 AM at Campus Academic Office (Room 102). Please bring original birth certificate & previous report card.
                  </p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">No Application Found</p>
            <p>Please double check the reference code or contact admissions desk at +880 1711-234567.</p>
          </Card>
        )
      )}

    </div>
  );
};
