import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Student } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Calendar, Check, X, Clock, HelpCircle, Save, 
  Download, Printer, RefreshCw, CheckCircle2 
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A (Padma)');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Load existing records or initialize with 'present'
  useEffect(() => {
    const existing = StorageService.getAttendanceForDate(date, selectedClass, selectedSection);
    const initial: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    const filtered = students.filter(s => s.className === selectedClass);
    
    filtered.forEach(s => {
      initial[s.id] = existing[s.id] || 'present';
    });
    setAttendance(initial);
  }, [date, selectedClass, selectedSection, students]);

  const filteredStudents = students.filter(s => s.className === selectedClass);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    filteredStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  const handleSave = () => {
    StorageService.saveAttendanceForDate(date, selectedClass, selectedSection, attendance);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'late').length;
  const rate = filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  const handleExportCSV = () => {
    const headers = ['Roll', 'Name', 'Class', 'Date', 'Attendance Status'];
    const rows = filteredStudents.map(s => [
      s.rollNo,
      `"${s.fullName}"`,
      s.className,
      date,
      attendance[s.id] || 'present'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Attendance_${selectedClass}_${date}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.attendance} — Daily Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record, audit and synchronize student attendance with automated SMS dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            icon={savedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
          >
            {savedFeedback ? 'Saved Successfully!' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Date & Filter Controls Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 6">Class 6</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="Section A (Padma)">Section A (Padma)</option>
              <option value="Section B (Meghna)">Section B (Meghna)</option>
              <option value="Section A (Jamuna)">Section A (Jamuna)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => handleMarkAll('present')}
            >
              Mark All Present
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-3 text-center border-l-4 border-l-slate-400">
          <p className="text-[11px] text-slate-500 font-medium">Total Enrolled</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredStudents.length}</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-emerald-500">
          <p className="text-[11px] text-slate-500 font-medium">Present</p>
          <p className="text-xl font-bold text-emerald-600">{presentCount} ({rate}%)</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-rose-500">
          <p className="text-[11px] text-slate-500 font-medium">Absent</p>
          <p className="text-xl font-bold text-rose-600">{absentCount}</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-amber-500">
          <p className="text-[11px] text-slate-500 font-medium">Late Arrival</p>
          <p className="text-xl font-bold text-amber-600">{lateCount}</p>
        </Card>
      </div>

      {/* Students Attendance Sheet Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4 text-center">Status Action</th>
                <th className="py-3 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => {
                const currentStatus = attendance[s.id] || 'present';
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{s.rollNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={s.photoUrl} alt={s.fullName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{s.fullName}</p>
                          <p className="text-[10px] text-slate-400">{s.guardianPhone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {s.admissionNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'present')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'absent')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'late')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={currentStatus === 'present' ? 'emerald' : currentStatus === 'absent' ? 'rose' : 'amber'}
                      >
                        {currentStatus.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
