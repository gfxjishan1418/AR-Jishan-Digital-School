import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { StorageService } from '../../lib/storage';
import { ExamResult, Student } from '../../types';
import { INITIAL_EXAMS, INITIAL_EXAM_RESULTS } from '../../data/initialMockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PrintableReportCard } from '../../components/common/PrintableReportCard';
import { 
  Award, Search, Printer, Plus, CheckCircle2, 
  Sparkles, FileText, BarChart2, Edit3 
} from 'lucide-react';

export const Examinations: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();
  const [students] = useState<Student[]>(() => StorageService.getStudents());
  const [results, setResults] = useState<ExamResult[]>(() => StorageService.getExamResults());
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState(false);

  // Mark entry form state
  const [entryStudentId, setEntryStudentId] = useState(students[0]?.id || '');
  const [entrySubject, setEntrySubject] = useState('Mathematics');
  const [entryMarks, setEntryMarks] = useState<number>(85);
  const [entryRemarks, setEntryRemarks] = useState('Good performance');

  const filteredResults = results.filter(r => r.className === selectedClass);

  const calculateGrade = (marks: number): { grade: string; gpa: number } => {
    if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
    if (marks >= 70) return { grade: 'A', gpa: 4.0 };
    if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
    if (marks >= 50) return { grade: 'B', gpa: 3.0 };
    if (marks >= 40) return { grade: 'C', gpa: 2.0 };
    if (marks >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === entryStudentId);
    if (!st) return;

    const { grade, gpa } = calculateGrade(Number(entryMarks));
    const newResult: ExamResult = {
      id: `res-${Date.now()}`,
      examId: 'ex-01',
      studentId: st.id,
      studentName: st.fullName,
      rollNo: st.rollNo,
      className: st.className,
      sectionName: st.sectionName,
      subjectId: 'sub-new',
      subjectName: entrySubject,
      marksObtained: Number(entryMarks),
      maxMarks: 100,
      grade,
      gradePoint: gpa,
      remarks: entryRemarks,
    };

    const updated = StorageService.saveExamResult(newResult);
    setResults(updated);
    setIsMarksEntryOpen(false);
  };

  const handleOpenReportCard = (studentId: string) => {
    const st = students.find(s => s.id === studentId);
    if (st) {
      setSelectedStudentForReport(st);
      setIsReportModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.examinations} & Assessment Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bangla NCTB Grading System (GPA 5.0), Subject-wise marksheets & Printable Academic Transcripts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsMarksEntryOpen(true)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Enter Marks
          </Button>
        </div>
      </div>

      {/* Active Exam Banner */}
      <Card className="p-4 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Mid-Term Assessment 2026</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                  Results Published
                </span>
              </div>
              <p className="text-xs text-brand-200">Classes 6 to 10 • Academic Session 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-brand-100">
              Pass Rate: <strong>98.4%</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-brand-100">
              GPA 5.0 (A+): <strong>42 Students</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Class Filter & Selection */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-500">Filter by Class:</label>
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

          <p className="text-xs text-slate-500">
            Showing {filteredResults.length} marks entries for {selectedClass}
          </p>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Marks Obtained</th>
                <th className="py-3 px-4 text-center">Letter Grade</th>
                <th className="py-3 px-4 text-center">GPA</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    #{r.rollNo}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {r.studentName}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {r.subjectName}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {r.marksObtained} / {r.maxMarks}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">
                    {r.gradePoint.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {r.remarks}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenReportCard(r.studentId)}
                      icon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Report Card
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isMarksEntryOpen}
        onClose={() => setIsMarksEntryOpen(false)}
        title="Record Examination Marks"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMarks} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Select Student</label>
            <select
              value={entryStudentId}
              onChange={(e) => setEntryStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} (Roll {s.rollNo} - {s.className})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <select
              value={entrySubject}
              onChange={(e) => setEntrySubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="Mathematics">General Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English Literature">English Literature</option>
              <option value="Bangla 1st Paper">Bangla 1st Paper</option>
              <option value="ICT">Information & Communication Tech</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Marks Obtained (out of 100)</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={entryMarks}
              onChange={(e) => setEntryMarks(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-base"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Teacher Remarks</label>
            <input
              type="text"
              value={entryRemarks}
              onChange={(e) => setEntryRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              placeholder="e.g. Excellent analytical performance"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsMarksEntryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Assessment Marks
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable Report Card Modal */}
      {selectedStudentForReport && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={`Official Report Card — ${selectedStudentForReport.fullName}`}
          maxWidth="4xl"
        >
          <PrintableReportCard
            student={selectedStudentForReport}
            results={results.filter(r => r.studentId === selectedStudentForReport.id)}
            school={school}
            examTitle="Mid-Term Assessment 2026"
          />
        </Modal>
      )}

    </div>
  );
};
