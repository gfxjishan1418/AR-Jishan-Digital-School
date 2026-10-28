import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { Shield, ChevronDown, Check, UserCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole, demoProfiles } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList: { id: UserRole; label: string; desc: string; color: string }[] = [
    { id: 'school_admin', label: t.roles.school_admin, desc: 'Full campus control & ERP access', color: 'bg-emerald-500' },
    { id: 'teacher', label: t.roles.teacher, desc: 'Class attendance, homework & gradebook', color: 'bg-sky-500' },
    { id: 'student', label: t.roles.student, desc: 'Personal timetable, results & AI tutor', color: 'bg-purple-500' },
    { id: 'parent', label: t.roles.parent, desc: 'Child attendance, fee payments & updates', color: 'bg-amber-500' },
    { id: 'accountant', label: t.roles.accountant, desc: 'bKash/Nagad collections & invoicing', color: 'bg-teal-500' },
    { id: 'receptionist', label: t.roles.receptionist, desc: 'Admission pipeline & visitors', color: 'bg-rose-500' },
    { id: 'super_admin', label: t.roles.super_admin, desc: 'Multi-school SaaS tenant manager', color: 'bg-indigo-500' },
  ];

  const currentRoleInfo = rolesList.find(r => r.id === role) || rolesList[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-sm"
        title="Switch Demo Role"
      >
        <span className={`w-2 h-2 rounded-full ${currentRoleInfo.color} animate-pulse`} />
        <span className="font-semibold text-slate-900 dark:text-white max-w-[120px] truncate sm:max-w-none">
          {currentRoleInfo.label}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t.common.switchRole}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate different role permissions instantly
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto py-1">
              {rolesList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    switchRole(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    role === item.id ? 'bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {role === item.id && (
                    <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
