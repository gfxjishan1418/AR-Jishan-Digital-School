import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { 
  BATCH_OVERVIEW_DATA, INQUIRY_LEADS_DATA, TODAY_SCHEDULE, 
  INITIAL_AI_DEFAULTERS, INITIAL_AI_FOLLOW_UPS, INITIAL_SUBJECTS 
} from '../../data/initialMockData';
import { 
  Users, GraduationCap, UserPlus, CreditCard, AlertCircle, 
  Sparkles, TrendingUp, TrendingDown, Clock, CheckCircle2, 
  Phone, Mail, Calendar, ArrowUpRight, ChevronRight, Activity, 
  Bot, ShieldCheck, Database, Server, RefreshCw, Send, Check 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAiChat: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenAiChat,
}) => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();
  const [completedInquiries, setCompletedInquiries] = useState<string[]>([]);

  const toggleInquiryAction = (id: string) => {
    if (completedInquiries.includes(id)) {
      setCompletedInquiries(completedInquiries.filter(i => i !== id));
    } else {
      setCompletedInquiries([...completedInquiries, id]);
    }
  };

  // Staff Attendance Donut Data
  const attendanceDonut = [
    { name: 'Present', value: 79, color: '#10b981' },
    { name: 'Absent', value: 5, color: '#f43f5e' },
    { name: 'On Leave', value: 2, color: '#0ea5e9' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.dashboard.adminDashboard}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {school.name} • {t.dashboard.academicYear} • EIIN: {school.eiinNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenAiChat}
            icon={<Sparkles className="w-3.5 h-3.5 text-brand-600" />}
          >
            {t.ai.aiAssistant}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigateTab('students')}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            {t.actions.addStudent}
          </Button>
        </div>
      </div>

      {/* Top 5 Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Students */}
        <Card hoverable onClick={() => onNavigateTab('students')} className="border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.metrics.totalStudents}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,248</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+8.4% {t.metrics.thisMonth}</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Total Teachers */}
        <Card hoverable onClick={() => onNavigateTab('teachers')} className="border-l-4 border-l-emerald-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.metrics.totalTeachers}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">86</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+6.1% {t.metrics.thisMonth}</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* New Admissions */}
        <Card hoverable onClick={() => onNavigateTab('admissions')} className="border-l-4 border-l-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.metrics.newAdmissions}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">58</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.3% {t.metrics.thisMonth}</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Fee Collection (May) */}
        <Card hoverable onClick={() => onNavigateTab('fees')} className="border-l-4 border-l-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.metrics.feeCollection}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">৳18.75L</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+15.6% vs Apr</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Pending Fees */}
        <Card hoverable onClick={() => onNavigateTab('fees')} className="border-l-4 border-l-rose-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.metrics.pendingFees}</p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">৳6.42L</h3>
              <p className="text-[11px] font-bold text-rose-500 flex items-center gap-0.5 mt-1">
                <TrendingDown className="w-3 h-3" />
                <span>+5.2% vs Apr</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

      </div>

      {/* Quick Actions Row */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.dashboard.quickActions}
          </span>
          <span className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            {t.dashboard.customize}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab('students')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <span>{t.actions.addStudent}</span>
          </button>

          <button
            onClick={() => onNavigateTab('teachers')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span>{t.actions.addTeacher}</span>
          </button>

          <button
            onClick={() => onNavigateTab('batches')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span>{t.actions.createBatch}</span>
          </button>

          <button
            onClick={() => onNavigateTab('courses')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>{t.actions.manageCourses}</span>
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span>{t.actions.generateReport}</span>
          </button>

          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-800 dark:text-brand-300 transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>{t.actions.aiInsights}</span>
          </button>
        </div>
      </Card>

      {/* Main Grid: Visual Charts & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Batch Management Overview & Course Management Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Batch Management Overview Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Batch Management Overview</h3>
                <p className="text-xs text-slate-500">Distribution across Nursery, Primary, Middle, High School & Senior</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-blue-500" /> Active (28)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Completed (18)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-purple-500" /> Upcoming (8)</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BATCH_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, fontSize: 12, backgroundColor: '#0f172a', color: '#fff', border: 'none' }}
                  />
                  <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="upcoming" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Course Management Table */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Course Management</h3>
                <p className="text-xs text-slate-500">Active subjects & assigned academic cohorts</p>
              </div>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Course Name</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3 text-center">Batches</th>
                    <th className="py-2.5 px-3 text-center">Students</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {INITIAL_SUBJECTS.slice(0, 5).map((subj) => (
                    <tr key={subj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{subj.name}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{subj.code}</td>
                      <td className="py-2.5 px-3 text-center font-medium">{subj.batchesCount}</td>
                      <td className="py-2.5 px-3 text-center font-medium">{subj.studentsCount}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="emerald" size="sm">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Col: Staff Attendance Donut & Today's Schedule Timeline */}
        <div className="space-y-6">
          
          {/* Staff Attendance Overview (Donut Chart 92%) */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Staff Attendance Overview</h3>
              <Badge variant="emerald" size="sm">Today</Badge>
            </div>

            <div className="flex items-center justify-center relative py-2">
              <div className="w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceDonut}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendanceDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white">92%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Present</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <p className="text-[11px] text-slate-400">Present</p>
                <p className="font-bold text-emerald-600">79 (92%)</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Absent</p>
                <p className="font-bold text-rose-600">5 (6%)</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">On Leave</p>
                <p className="font-bold text-sky-600">2 (2%)</p>
              </div>
            </div>
          </Card>

          {/* Today's Schedule Timeline */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.dashboard.todaySchedule}</h3>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                {t.dashboard.viewTimetable}
              </button>
            </div>

            <div className="space-y-3">
              {TODAY_SCHEDULE.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-start group">
                  <span className="font-mono text-slate-400 text-[11px] shrink-0 w-16 pt-0.5">
                    {item.time}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                    <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.location} • {item.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

      {/* AI Features Row: Prediction, Defaulters Risk, Follow-ups, Insights of the Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. AI Admission Prediction */}
        <Card className="bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-sky-950/20 border-sky-200/80 dark:border-sky-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              {t.ai.admissionPrediction}
            </span>
            <Badge variant="blue" size="sm">This Month</Badge>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">72%</h3>
            <span className="text-xs font-bold text-emerald-600">High Probability</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Predicted Conversion Rate</p>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Predicted Admissions</p>
              <p className="font-bold text-slate-900 dark:text-white">84 Students</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Confidence Score</p>
              <p className="font-bold text-emerald-600">High (94%)</p>
            </div>
          </div>
        </Card>

        {/* 2. AI Fee Defaulter Risk Alerts */}
        <Card className="bg-gradient-to-br from-white to-rose-50/40 dark:from-slate-900 dark:to-rose-950/20 border-rose-200/80 dark:border-rose-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              {t.ai.feeDefaulterAlerts}
            </span>
            <button onClick={() => onNavigateTab('fees')} className="text-[10px] text-rose-600 font-bold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-2 mt-2">
            {INITIAL_AI_DEFAULTERS.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.studentName}</p>
                  <p className="text-[10px] text-slate-400">{item.className} • ৳{item.dueAmount.toLocaleString()}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  item.riskScore > 75 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {item.riskScore}% Risk
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 3. AI-Powered Inquiry Follow-ups */}
        <Card className="bg-gradient-to-br from-white to-purple-50/40 dark:from-slate-900 dark:to-purple-950/20 border-purple-200/80 dark:border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-500" />
              {t.ai.inquiryFollowUp}
            </span>
            <Badge variant="purple" size="sm">4 Pending</Badge>
          </div>

          <div className="space-y-2 mt-2">
            {INITIAL_AI_FOLLOW_UPS.slice(0, 2).map((inq) => {
              const isDone = completedInquiries.includes(inq.id);
              return (
                <div key={inq.id} className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/40 text-xs">
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">{inq.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{inq.context}</p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-purple-600">{inq.timing}</span>
                    <button
                      onClick={() => toggleInquiryAction(inq.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                      }`}
                    >
                      {isDone ? 'Completed ✓' : 'Execute'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 4. AI Insights of the Day & System Health */}
        <Card className="bg-gradient-to-br from-brand-900 to-slate-900 text-white border-brand-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-brand-300" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-200">{t.dashboard.aiInsightsOfDay}</h4>
          </div>

          <p className="text-xs text-brand-100 leading-relaxed mt-1">
            "Student performance in Mathematics (Class 10) has improved by <strong>14%</strong> following the AI-assisted diagnostic revisions."
          </p>

          <div className="mt-4 pt-3 border-t border-brand-800/80 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-brand-200">
              <span className="flex items-center gap-1.5"><Server className="w-3 h-3 text-emerald-400" /> Core System:</span>
              <span className="font-bold text-emerald-400">100% Operational</span>
            </div>
            <div className="flex items-center justify-between text-brand-200">
              <span className="flex items-center gap-1.5"><Database className="w-3 h-3 text-sky-400" /> Supabase DB:</span>
              <span className="font-bold text-sky-400">Optimized</span>
            </div>
            <div className="flex items-center justify-between text-brand-200">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-amber-400" /> Security RLS:</span>
              <span className="font-bold text-amber-300">Enforced</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Operational Summary: Inquiry Leads Chart & Parent Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inquiry Leads Trend (Line Chart) */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inquiry / Leads Overview</h3>
                <p className="text-xs text-slate-500">Daily admission inquiries and conversions (Last 7 Days)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> New Inquiries</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Converted</span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INQUIRY_LEADS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, backgroundColor: '#0f172a', color: '#fff', border: 'none' }} />
                  <Line type="monotone" dataKey="newInquiries" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Parent Communication Summary */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.dashboard.parentCommunication}</h3>
            <Badge variant="blue" size="sm">This Month</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Messages Sent</span>
              </div>
              <span className="font-black text-slate-900 dark:text-white">256 (↑18%)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Delivered</span>
              </div>
              <span className="font-black text-slate-900 dark:text-white">248 (↑13%)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Read Receipts</span>
              </div>
              <span className="font-black text-slate-900 dark:text-white">189 (↑21%)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Response Rate</span>
              <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">74%</span>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
