import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Download, TrendingUp, Users, Award, CreditCard } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { school } = useSchool();

  const gradeDistribution = [
    { grade: 'A+ (5.0)', count: 42, color: '#10b981' },
    { grade: 'A (4.0)', count: 68, color: '#3b82f6' },
    { grade: 'A- (3.5)', count: 45, color: '#0ea5e9' },
    { grade: 'B (3.0)', count: 28, color: '#f59e0b' },
    { grade: 'C (2.0)', count: 12, color: '#a855f7' },
    { grade: 'F (0.0)', count: 2, color: '#f43f5e' },
  ];

  const monthlyCollection = [
    { month: 'Jan', amount: 14.2 },
    { month: 'Feb', amount: 15.8 },
    { month: 'Mar', amount: 16.5 },
    { month: 'Apr', amount: 16.2 },
    { month: 'May', amount: 18.75 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sectional performance audits: Academic Grades, Fee Realization & Attendance
          </p>
        </div>

        <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />}>
          Export PDF Annual Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Grade Distribution Bar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Academic Grade Distribution (GPA 5.0)</h3>
              <p className="text-xs text-slate-500">Mid-Term Assessment 2026 Cohort Results</p>
            </div>
            <Badge variant="emerald">Pass Rate 98.9%</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, backgroundColor: '#0f172a', color: '#fff', border: 'none' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Fee Collection Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fee Realization Trend (Lakh BDT)</h3>
              <p className="text-xs text-slate-500">Jan — May 2026 Collection trajectory</p>
            </div>
            <Badge variant="blue">+15.6% Growth</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCollection}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, backgroundColor: '#0f172a', color: '#fff', border: 'none' }} />
                <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};
