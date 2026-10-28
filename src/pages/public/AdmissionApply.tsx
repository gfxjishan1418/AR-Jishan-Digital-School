import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { AdmissionApplication } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  GraduationCap, CheckCircle2, Copy, Check, ArrowRight, 
  FileText, ShieldCheck, Phone, Mail, User 
} from 'lucide-react';

interface AdmissionApplyProps {
  onNavigate: (page: string) => void;
}

export const AdmissionApply: React.FC<AdmissionApplyProps> = ({ onNavigate }) => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();

  const [applicantName, setApplicantName] = useState('');
  const [applyingClass, setApplyingClass] = useState('Class 9');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('2011-05-15');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !guardianPhone || !guardianName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const appNumber = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newApp: AdmissionApplication = {
        id: `app-${Date.now()}`,
        applicationNo: appNumber,
        applicantName,
        applyingClass,
        gender,
        dateOfBirth: dob,
        guardianName,
        guardianPhone,
        guardianEmail,
        previousSchool,
        address,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Under Review',
      };

      StorageService.addApplication(newApp);
      setSubmittedApp(newApp);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyCode = () => {
    if (submittedApp) {
      navigator.clipboard.writeText(submittedApp.applicationNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">Admissions Session 2026</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Online Admission Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {school.name} — Please provide accurate student and guardian information as registered in birth certificate.
        </p>
      </div>

      {submittedApp ? (
        <Card className="p-8 text-center space-y-6 border-2 border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Application Successfully Submitted!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your application has been received and assigned a unique reference code. Save this code to track your interview schedule and result.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 inline-block max-w-md w-full">
            <p className="text-[11px] text-slate-400 font-medium">Tracking Reference Number</p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-2xl font-black font-mono text-brand-700 dark:text-brand-300">
                {submittedApp.applicationNo}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => onNavigate('track')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Track Application Status
            </Button>
            <Button
              variant="outline"
              onClick={() => setSubmittedApp(null)}
            >
              Submit Another Application
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Student Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>1. Applicant Student Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Applicant Full Name (as per Birth Cert) *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                    placeholder="e.g. Nusrat Jahan"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Seeking Admission To Class *
                  </label>
                  <select
                    value={applyingClass}
                    onChange={(e) => setApplyingClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9 (Science / Business / Humanities)</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guardian Info */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Phone className="w-4 h-4 text-brand-600" />
                <span>2. Parent / Guardian Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    placeholder="e.g. Dr. Anwarul Karim"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Mobile Phone Number (SMS alerts) *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    placeholder="+880 1711-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    placeholder="guardian@example.com"
                  />
                </div>
              </div>
            </div>

            {/* School History */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>3. Academic Background & Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Previous School / Institute
                  </label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    placeholder="e.g. Viqarunnisa Noon School"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    placeholder="House, Road, Area, Dhaka"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your application data is protected by Row Level Security</span>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isSubmitting}
              >
                Submit Admission Application
              </Button>
            </div>
          </form>
        </Card>
      )}

    </div>
  );
};
