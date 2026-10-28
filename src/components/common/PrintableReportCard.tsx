import React from 'react';
import { Student, ExamResult, School } from '../../types';
import { Button } from '../ui/Button';
import { Printer, Award } from 'lucide-react';

interface PrintableReportCardProps {
  student: Student;
  results: ExamResult[];
  school: School;
  examTitle: string;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  results,
  school,
  examTitle,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalMarks = results.reduce((acc, curr) => acc + curr.marksObtained, 0);
  const totalMaxMarks = results.reduce((acc, curr) => acc + curr.maxMarks, 0);
  const averageGpa = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.gradePoint, 0) / results.length).toFixed(2)
    : '0.00';

  const overallGrade = Number(averageGpa) >= 5 ? 'A+' :
                       Number(averageGpa) >= 4 ? 'A' :
                       Number(averageGpa) >= 3.5 ? 'A-' :
                       Number(averageGpa) >= 3 ? 'B' :
                       Number(averageGpa) >= 2 ? 'C' :
                       Number(averageGpa) >= 1 ? 'D' : 'F';

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <Button onClick={handlePrint} variant="primary" icon={<Printer className="w-4 h-4" />}>
          Print Academic Transcript
        </Button>
      </div>

      <div className="print-area bg-white text-slate-900 p-8 rounded-2xl border-2 border-brand-800 shadow-sm max-w-3xl mx-auto font-sans">
        {/* Header with decorative frame */}
        <div className="text-center border-b-2 border-brand-800 pb-4 mb-6 relative">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src={school.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-brand-700" />
            <div className="text-left">
              <h2 className="text-xl font-black text-brand-950 uppercase tracking-wide">{school.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{school.address}</p>
              <p className="text-xs text-slate-500">EIIN: {school.eiinNumber} • Affiliated with {school.board}</p>
            </div>
          </div>
          
          <div className="mt-3 inline-block px-6 py-1 bg-brand-800 text-white font-bold text-sm uppercase tracking-widest rounded-full">
            Official Academic Transcript / Progress Report
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1">{examTitle} — Session 2026</p>
        </div>

        {/* Student Profile Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs mb-6">
          <div>
            <p className="text-slate-500 font-medium">Student Name:</p>
            <p className="font-bold text-slate-900">{student.fullName}</p>
            {student.banglaName && <p className="font-bangla text-slate-600">{student.banglaName}</p>}
          </div>
          <div>
            <p className="text-slate-500 font-medium">Roll No / ID:</p>
            <p className="font-bold text-slate-900">Roll: {student.rollNo} • ID: {student.admissionNo}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Class & Section:</p>
            <p className="font-bold text-slate-900">{student.className} — {student.sectionName}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Attendance Rate:</p>
            <p className="font-bold text-emerald-700">{student.attendanceRate}% Present</p>
          </div>
        </div>

        {/* Marks Sheet Table */}
        <table className="w-full text-xs text-left mb-6 border border-slate-300">
          <thead className="bg-brand-50 border-b border-slate-300 text-brand-950 font-bold">
            <tr>
              <th className="py-2.5 px-3">Subject Name</th>
              <th className="py-2.5 px-3 text-center">Max Marks</th>
              <th className="py-2.5 px-3 text-center">Marks Obtained</th>
              <th className="py-2.5 px-3 text-center">Letter Grade</th>
              <th className="py-2.5 px-3 text-center">Grade Point</th>
              <th className="py-2.5 px-3">Teacher Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">{res.subjectName}</td>
                <td className="py-2.5 px-3 text-center text-slate-500">{res.maxMarks}</td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-900">{res.marksObtained}</td>
                <td className="py-2.5 px-3 text-center font-bold text-brand-700">{res.grade}</td>
                <td className="py-2.5 px-3 text-center font-bold">{res.gradePoint.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-slate-600 italic">{res.remarks}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 border-t-2 border-brand-800 font-bold text-slate-900">
            <tr>
              <td className="py-2.5 px-3 font-bold uppercase">Total / Summary</td>
              <td className="py-2.5 px-3 text-center">{totalMaxMarks}</td>
              <td className="py-2.5 px-3 text-center font-black text-brand-900">{totalMarks}</td>
              <td className="py-2.5 px-3 text-center text-brand-900 font-black">{overallGrade}</td>
              <td className="py-2.5 px-3 text-center text-brand-900 font-black">GPA {averageGpa}</td>
              <td className="py-2.5 px-3 text-emerald-800 font-semibold">Passed with Distinction</td>
            </tr>
          </tfoot>
        </table>

        {/* Grading Scale Footnote */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-600 mb-8">
          <p className="font-bold text-slate-800 mb-0.5">National Grading Scale (Board of Intermediate & Secondary Education):</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>80-100% : A+ (5.00)</span>
            <span>70-79% : A (4.00)</span>
            <span>60-69% : A- (3.50)</span>
            <span>50-59% : B (3.00)</span>
            <span>40-49% : C (2.00)</span>
            <span>33-39% : D (1.00)</span>
            <span>0-32% : F (0.00 Fail)</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between pt-10 text-xs text-slate-600 border-t border-dashed border-slate-300">
          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1"></div>
            <p className="font-medium">Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1"></div>
            <p className="font-medium">Controller of Examinations</p>
          </div>
          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1"></div>
            <p className="font-medium text-brand-900 font-bold">Principal / Head of Institute</p>
          </div>
        </div>
      </div>
    </div>
  );
};
