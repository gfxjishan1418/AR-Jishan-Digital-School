import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, Calendar, Download, Printer, Plus } from 'lucide-react';

export const Timetable: React.FC = () => {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A (Padma)');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const periods = [
    { period: 1, time: '08:30 - 09:15 AM' },
    { period: 2, time: '09:15 - 10:00 AM' },
    { period: 3, time: '10:00 - 10:45 AM' },
    { period: 'Tiffin', time: '10:45 - 11:15 AM' },
    { period: 4, time: '11:15 - 12:00 PM' },
    { period: 5, time: '12:00 - 12:45 PM' },
    { period: 6, time: '12:45 - 01:30 PM' },
  ];

  const routineGrid: Record<string, Record<number, { subject: string; teacher: string; room: string }>> = {
    Sunday: {
      1: { subject: 'Mathematics', teacher: 'Dr. Rafiqul Islam', room: 'Room 205' },
      2: { subject: 'Bangla 1st Paper', teacher: 'Nasrin Sultana', room: 'Room 205' },
      3: { subject: 'Physics', teacher: 'Kamal Hossain', room: 'Lab 1' },
      4: { subject: 'English', teacher: 'Farhana Akter', room: 'Room 205' },
      5: { subject: 'Chemistry', teacher: 'Dr. Rafiqul', room: 'Lab 2' },
      6: { subject: 'ICT Practice', teacher: 'Kamal Hossain', room: 'Computer Lab' },
    },
    Monday: {
      1: { subject: 'Physics', teacher: 'Kamal Hossain', room: 'Room 205' },
      2: { subject: 'Mathematics', teacher: 'Dr. Rafiqul Islam', room: 'Room 205' },
      3: { subject: 'Chemistry', teacher: 'Dr. Rafiqul', room: 'Room 205' },
      4: { subject: 'Bangla 2nd Paper', teacher: 'Nasrin Sultana', room: 'Room 205' },
      5: { subject: 'Biology Lab', teacher: 'Farhana Akter', room: 'Bio Lab' },
      6: { subject: 'Physical Education', teacher: 'Coach Alam', room: 'Ground' },
    },
    Tuesday: {
      1: { subject: 'English Literature', teacher: 'Nasrin Sultana', room: 'Room 205' },
      2: { subject: 'Mathematics', teacher: 'Dr. Rafiqul Islam', room: 'Room 205' },
      3: { subject: 'Biology', teacher: 'Farhana Akter', room: 'Room 205' },
      4: { subject: 'Physics Lab', teacher: 'Kamal Hossain', room: 'Lab 1' },
      5: { subject: 'Higher Math', teacher: 'Dr. Rafiqul', room: 'Room 205' },
      6: { subject: 'Library Hour', teacher: 'Librarian', room: 'Library' },
    },
    Wednesday: {
      1: { subject: 'Chemistry Lab', teacher: 'Dr. Rafiqul', room: 'Lab 2' },
      2: { subject: 'English Grammar', teacher: 'Nasrin Sultana', room: 'Room 205' },
      3: { subject: 'Mathematics', teacher: 'Dr. Rafiqul Islam', room: 'Room 205' },
      4: { subject: 'Bangla 1st Paper', teacher: 'Nasrin Sultana', room: 'Room 205' },
      5: { subject: 'Social Science', teacher: 'Anisur Rahman', room: 'Room 205' },
      6: { subject: 'AI & Robotics Club', teacher: 'Kamal Hossain', room: 'STEM Lab' },
    },
    Thursday: {
      1: { subject: 'Mathematics Review', teacher: 'Dr. Rafiqul', room: 'Room 205' },
      2: { subject: 'Physics Problem Set', teacher: 'Kamal Hossain', room: 'Room 205' },
      3: { subject: 'English Speaking', teacher: 'Nasrin Sultana', room: 'Room 205' },
      4: { subject: 'Religion & Ethics', teacher: 'Hafez Mawlana', room: 'Room 205' },
      5: { subject: 'Weekly Quiz Assessment', teacher: 'Invigilator', room: 'Room 205' },
      6: { subject: 'Co-curricular Debate', teacher: 'Debate Club', room: 'Auditorium' },
    },
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.timetable} — Class Routine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly 6-day academic period allocation with conflict-free room & teacher schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint} icon={<Printer className="w-3.5 h-3.5" />}>
            Print Routine
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              >
                <option value="Section A (Padma)">Section A (Padma)</option>
                <option value="Section B (Meghna)">Section B (Meghna)</option>
              </select>
            </div>
          </div>

          <Badge variant="blue">Weekly 30 Periods • Effective Session 2026</Badge>
        </div>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-28">Day</th>
                {periods.map((p, idx) => (
                  <th key={idx} className="py-3 px-3 text-center min-w-[130px]">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {typeof p.period === 'number' ? `Period ${p.period}` : p.period}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono normal-case">{p.time}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white bg-slate-50/60 dark:bg-slate-800/40">
                    {day}
                  </td>

                  {periods.map((p, idx) => {
                    if (p.period === 'Tiffin') {
                      return (
                        <td key={idx} className="py-3 px-2 text-center bg-amber-50/40 dark:bg-amber-950/20 border-x border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                            Tiffin Break
                          </span>
                        </td>
                      );
                    }

                    const slot = routineGrid[day]?.[p.period as number];
                    return (
                      <td key={idx} className="py-2.5 px-2.5 text-center">
                        {slot ? (
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{slot.subject}</p>
                            <p className="text-[10px] text-brand-600 dark:text-brand-400 truncate">{slot.teacher}</p>
                            <p className="text-[9px] text-slate-400 font-mono">{slot.room}</p>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
