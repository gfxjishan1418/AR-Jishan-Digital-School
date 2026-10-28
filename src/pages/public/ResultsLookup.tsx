import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { Student, ExamResult } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PrintableReportCard } from '../../components/common/PrintableReportCard';
import { Modal } from '../../components/ui/Modal';
import { Search, Award, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ResultsLookup: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();
  const [rollNo, setRollNo] = useState(1);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [examType, setExamType] = useState('Mid-Term Assessment 2026');
  
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [foundResults, setFoundResults] = useState<ExamResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const students = StorageService.getStudents();
    const targetStudent = students.find(s => s.rollNo === Number(rollNo) && s.className === selectedClass);
    
    if (targetStudent) {
      setFoundStudent(targetStudent);
      const allResults = StorageService.getExamResults();
      const stResults = allResults.filter(r => r.studentId === targetStudent.id);
      setFoundResults(stResults);
    } else {
      setFoundStudent(null);
      setFoundResults([]);
    }
    setHasSearched(true);
  };

  const totalMarks = foundResults.reduce((acc, curr) => acc + curr.marksObtained, 0);
  const averageGpa = foundResults.length > 0 
    ? (foundResults.reduce((acc, curr) => acc + curr.gradePoint, 0) / foundResults.length).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">Official Examination Portal</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Online Student Result & Transcript Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Check term examination marksheet and Bangladesh Board GPA 5.0 transcript securely
        </p>
      </div>

      {/* Query Card */}
      <Card className="p-6">
        <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Roll Number</label>
            <input
              type="number"
              required
              min={1}
              value={rollNo}
              onChange={(e) => setRollNo(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              placeholder="e.g. 1"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Examination</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
            >
              <option value="Mid-Term Assessment 2026">Mid-Term Assessment 2026</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" variant="primary" className="w-full" size="md">
              View Marksheet
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Display */}
      {hasSearched && (
        foundStudent ? (
          <Card className="p-6 space-y-6 border-t-4 border-t-brand-600 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={foundStudent.photoUrl} alt={foundStudent.fullName} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/40" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{foundStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    Roll #{foundStudent.rollNo} • {foundStudent.className} ({foundStudent.sectionName}) • ID: {foundStudent.admissionNo}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Overall Result</p>
                  <p className="text-xl font-black text-brand-700 dark:text-brand-300">GPA {averageGpa}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsPrintModalOpen(true)} icon={<Printer className="w-3.5 h-3.5" />}>
                  Print Transcript
                </Button>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {foundResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{r.subjectName}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white">{r.marksObtained} / {r.maxMarks}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-brand-700 dark:text-brand-300">{r.grade}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{r.gradePoint.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Result Record verified under Dhaka Board secondary guidelines.</span>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-500 space-y-2">
            <p className="font-bold text-slate-900 dark:text-white text-sm">No Student Record Matches This Query</p>
            <p>Please check the Roll Number (e.g. 1) and Class selection.</p>
          </Card>
        )
      )}

      {/* Printable Report Modal */}
      {foundStudent && (
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="Digital AI School — Verified Academic Transcript"
          maxWidth="4xl"
        >
          <PrintableReportCard
            student={foundStudent}
            results={foundResults}
            school={school}
            examTitle={examType}
          />
        </Modal>
      )}

    </div>
  );
};
