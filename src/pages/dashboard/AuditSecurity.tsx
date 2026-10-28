import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Lock, Key, Activity, Server } from 'lucide-react';

export const AuditSecurity: React.FC = () => {
  const auditLogs = [
    { id: 'log-1', action: 'Fee Payment Recorded (৳4,500 via bKash)', user: 'Ms. Ria (Admin)', ip: '103.114.98.24', time: '10 mins ago', status: 'Verified' },
    { id: 'log-2', action: 'Mid-Term Exam Marks Saved (Class 10A)', user: 'Dr. Rafiqul (Faculty)', ip: '103.114.98.12', time: '25 mins ago', status: 'Success' },
    { id: 'log-3', action: 'Admission Application APP-2026-8491 Approved', user: 'Sabrina (Admissions)', ip: '103.114.98.5', time: '1 hour ago', status: 'Success' },
    { id: 'log-4', action: 'Daily Attendance Sheet Class 10 Synchronized', user: 'Dr. Rafiqul (Faculty)', ip: '103.114.98.12', time: '2 hours ago', status: 'Success' },
    { id: 'log-5', action: 'PostgreSQL Database Automated Backup Completed', user: 'System (Cron)', ip: '127.0.0.1', time: '02:00 AM', status: 'System' },
    { id: 'log-6', action: 'Row Level Security Policy Health Check Passed', user: 'Security Daemon', ip: '127.0.0.1', time: '02:05 AM', status: 'Verified' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Security Audit Trail & Compliance Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit logging of administrative changes, grade modifications, and financial collections
          </p>
        </div>
        <Badge variant="emerald">Audit Level: Strict</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-slate-500">Row Level Security (RLS)</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">Active on 34 Tables</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-xs font-semibold text-slate-500">Authentication Protocol</p>
          <p className="text-lg font-bold text-blue-600 mt-1">Supabase JWT + RBAC</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <p className="text-xs font-semibold text-slate-500">Privileged Secrets</p>
          <p className="text-lg font-bold text-purple-600 mt-1">Zero Leaked in Bundle</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent System Audit Events</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.action}</td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                  <td className="py-3 px-4">
                    <Badge variant="emerald" size="sm">{log.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
