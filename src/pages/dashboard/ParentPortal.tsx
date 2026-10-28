import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Users, CalendarCheck, Award, CreditCard, 
  Phone, Mail, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();

  const students = StorageService.getStudents();
  const child = students.find(s => s.id === 'stu-101') || students[0];
  const examResults = StorageService.getExamResults().filter(r => r.studentId === child.id);
  const invoices = StorageService.getInvoices().filter(i => i.studentId === child.id);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <Card className="p-6 bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Authorized Guardian Portal
            </span>
            <h1 className="text-xl font-black text-white mt-0.5">Welcome, {user.name}</h1>
            <p className="text-xs text-amber-100/80">
              Monitoring academic progress for your linked ward at {school.name}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/20">
            <img src={child.photoUrl} alt={child.fullName} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <p className="text-xs font-bold text-white">{child.fullName}</p>
              <p className="text-[10px] text-amber-200">{child.className} • Roll {child.rollNo}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Card className="border-l-4 border-l-emerald-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Attendance Status</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{child.attendanceRate}% Present</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">No unexcused absences</p>
            </div>
            <CalendarCheck className="w-8 h-8 text-emerald-500/30" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Academic Standing</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">GPA 5.00 (A+)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Ranked #1 in Class 10A</p>
            </div>
            <Award className="w-8 h-8 text-blue-500/30" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Tuition Invoices</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">Cleared ✓</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Next billing date: 01 June 2026</p>
            </div>
            <CreditCard className="w-8 h-8 text-amber-500/30" />
          </div>
        </Card>

      </div>

      {/* Report & Teacher Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Child Exam Marks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Mid-Term Assessment Transcript</h3>
            <Badge variant="emerald">Session 2026</Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {examResults.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{r.subjectName}</p>
                  <p className="text-[10px] text-slate-400">{r.remarks}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{r.marksObtained} Marks</span>
                  <span className="ml-2 font-black px-1.5 py-0.5 rounded-sm bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {r.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Assigned Faculty & Direct Contact */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assigned Class Teacher & Faculty</h3>
            <Badge variant="blue">Padma Section</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Dr. Rafiqul Islam</p>
                <p className="text-[11px] text-slate-500">Class Teacher • Mathematics</p>
                <p className="text-[10px] text-brand-600 mt-1 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" /> +880 1711-889900
                </p>
              </div>
              <Button size="sm" variant="outline">
                Contact Teacher
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Nasrin Sultana</p>
                <p className="text-[11px] text-slate-500">English Literature & Language Head</p>
                <p className="text-[10px] text-brand-600 mt-1 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" /> +880 1819-556677
                </p>
              </div>
              <Button size="sm" variant="outline">
                Contact Teacher
              </Button>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
