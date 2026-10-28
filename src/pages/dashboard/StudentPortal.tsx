import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  GraduationCap, CalendarCheck, Clock, Award, CreditCard, 
  Sparkles, BookOpen, CheckCircle2, ChevronRight, FileText 
} from 'lucide-react';

export const StudentPortal: React.FC<{ onOpenAiChat: () => void }> = ({ onOpenAiChat }) => {
  const { user } = useAuth();
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();

  const students = StorageService.getStudents();
  const student = students.find(s => s.id === 'stu-101') || students[0];
  const examResults = StorageService.getExamResults().filter(r => r.studentId === student.id);
  const invoices = StorageService.getInvoices().filter(i => i.studentId === student.id);

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <Card className="p-6 bg-gradient-to-r from-brand-800 via-brand-700 to-slate-900 text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{student.fullName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-400/20 text-brand-200 border border-brand-300/30">
                  Roll #{student.rollNo}
                </span>
              </div>
              <p className="text-xs text-brand-100 mt-0.5">
                {student.className} • {student.sectionName} • ID: {student.admissionNo}
              </p>
              <p className="text-[11px] text-brand-200/80 mt-1">{school.name}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="electric"
            onClick={onOpenAiChat}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Ask Nova AI Study Tutor
          </Button>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 p-4">
          <p className="text-xs font-semibold text-slate-500">Attendance Rate</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{student.attendanceRate}%</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Present 72 of 75 days</p>
        </Card>

        <Card className="border-l-4 border-l-blue-500 p-4">
          <p className="text-xs font-semibold text-slate-500">Mid-Term GPA</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">GPA 5.00</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">A+ (Distinction)</p>
        </Card>

        <Card className="border-l-4 border-l-purple-500 p-4">
          <p className="text-xs font-semibold text-slate-500">Pending Homework</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">1 Task</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Due tomorrow (Physics Lab)</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500 p-4">
          <p className="text-xs font-semibold text-slate-500">Tuition Fee Status</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">Paid ✓</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">May 2026 cleared via bKash</p>
        </Card>
      </div>

      {/* Academic Marks & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Results */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Examination Results</h3>
            </div>
            <Badge variant="emerald">Mid-Term 2026</Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {examResults.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{r.subjectName}</p>
                  <p className="text-[11px] text-slate-400">{r.remarks}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{r.marksObtained} / {r.maxMarks}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    Grade {r.grade} ({r.gradePoint.toFixed(2)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Timetable Today */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Today's Academic Classes</h3>
            </div>
            <Badge variant="blue">Today</Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">General Mathematics</p>
                <p className="text-[11px] text-slate-500">Dr. Rafiqul Islam • Room 205</p>
              </div>
              <span className="font-mono text-xs font-semibold text-brand-600">08:30 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Bangla 1st Paper</p>
                <p className="text-[11px] text-slate-500">Nasrin Sultana • Room 205</p>
              </div>
              <span className="font-mono text-xs font-semibold text-brand-600">09:15 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Physics Lab Practicum</p>
                <p className="text-[11px] text-slate-500">Kamal Hossain • Science Lab 1</p>
              </div>
              <span className="font-mono text-xs font-semibold text-brand-600">10:00 AM</span>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
