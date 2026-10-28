import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Student } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  Search, Plus, Download, Upload, Filter, Edit, 
  Trash2, Eye, UserCheck, Phone, Mail, MapPin, Printer,
  Camera, UploadCloud, Image as ImageIcon, Sparkles,
  FileSpreadsheet, CheckCircle2, AlertCircle
} from 'lucide-react';
import { downloadCSV, generateStudentCSVTemplate, parseStudentsCSV } from '../../lib/csvHelper';

export const StudentsList: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Import CSV State
  const [importPreview, setImportPreview] = useState<Student[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    banglaName: '',
    rollNo: 1,
    className: 'Class 10',
    sectionName: 'Section A (Padma)',
    gender: 'Male',
    dateOfBirth: '2010-01-01',
    bloodGroup: 'A+',
    religion: 'Islam',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Father',
    address: 'Dhanmondi, Dhaka',
    status: 'Active',
    feeStatus: 'Paid',
    attendanceRate: 95,
    photoUrl: '',
  });

  const STUDENT_AVATAR_PRESETS = [
    { label: 'Boy 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
    { label: 'Girl 1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
    { label: 'Boy 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
    { label: 'Girl 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
    { label: 'Boy 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    { label: 'Girl 3', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert(isBangla ? 'ছবির সাইজ ৩ মেগাবাইটের কম হতে হবে।' : 'Image size must be under 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData(prev => ({ ...prev, photoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = 
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.banglaName && s.banglaName.includes(search)) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toString().includes(search);
    const matchClass = selectedClass === 'all' || s.className === selectedClass;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.guardianPhone) {
      alert('Please fill in Student Name and Guardian Phone');
      return;
    }

    if (activeStudent) {
      // Edit
      const updatedStudent: Student = {
        ...activeStudent,
        ...formData as Student,
        photoUrl: formData.photoUrl || activeStudent.photoUrl || STUDENT_AVATAR_PRESETS[0].url,
      };
      const list = StorageService.updateStudent(updatedStudent);
      setStudents(list);
    } else {
      // Create new
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        rollNo: Number(formData.rollNo) || (students.length + 1),
        fullName: formData.fullName || '',
        banglaName: formData.banglaName,
        gender: formData.gender as any || 'Male',
        dateOfBirth: formData.dateOfBirth || '2010-01-01',
        bloodGroup: formData.bloodGroup || 'O+',
        religion: formData.religion || 'Islam',
        classId: 'c10',
        className: formData.className || 'Class 10',
        sectionId: 's10a',
        sectionName: formData.sectionName || 'Section A (Padma)',
        guardianName: formData.guardianName || '',
        guardianPhone: formData.guardianPhone || '',
        guardianRelation: formData.guardianRelation || 'Father',
        address: formData.address || 'Dhaka',
        photoUrl: formData.photoUrl || (formData.gender === 'Female' ? STUDENT_AVATAR_PRESETS[1].url : STUDENT_AVATAR_PRESETS[0].url),
        status: 'Active',
        feeStatus: 'Paid',
        attendanceRate: 95,
        enrolledDate: new Date().toISOString().split('T')[0],
      };
      const list = StorageService.addStudent(newStudent);
      setStudents(list);
    }

    setIsAddModalOpen(false);
    setActiveStudent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this student record?')) {
      const list = StorageService.deleteStudent(id);
      setStudents(list);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Admission No', 'Roll', 'Name', 'Class', 'Section', 'Guardian', 'Phone', 'Status', 'Fee Status'];
    const rows = filteredStudents.map(s => [
      s.admissionNo,
      s.rollNo,
      `"${s.fullName}"`,
      s.className,
      s.sectionName,
      `"${s.guardianName}"`,
      s.guardianPhone,
      s.status,
      s.feeStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_List_DAI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseStudentsCSV(text, students.length);
        if (parsed.length === 0) {
          setImportError(isBangla ? 'সিএসভি ফাইল থেকে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি। অনুগ্রহ করে নমুনা ফাইলটি অনুসরণ করুন।' : 'No valid student rows found. Please check your CSV format.');
          setImportPreview([]);
        } else {
          setImportPreview(parsed);
        }
      } catch (err: any) {
        setImportError(isBangla ? 'ফাইল পড়তে সমস্যা হয়েছে: ' + err.message : 'Error reading file: ' + err.message);
        setImportPreview([]);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importPreview.length === 0) return;
    const updated = StorageService.addStudents(importPreview);
    setStudents(updated);
    alert(isBangla 
      ? `অভিনন্দন! মোট ${importPreview.length} জন শিক্ষার্থীর তথ্য সফলভাবে ডাটাবেজে ইমপোর্ট করা হয়েছে।` 
      : `Success! ${importPreview.length} students have been successfully imported.`);
    setIsImportModalOpen(false);
    setImportPreview([]);
    setImportFileName('');
  };

  const handleDownloadTemplate = () => {
    const template = generateStudentCSVTemplate();
    downloadCSV('students_import_template.csv', template);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.students} — SIS Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Enrolled: {students.length} students across all active batches
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            {t.common.exportCSV}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setImportPreview([]);
              setImportFileName('');
              setImportError(null);
              setIsImportModalOpen(true);
            }}
            icon={<Upload className="w-3.5 h-3.5 text-emerald-600" />}
          >
            {isBangla ? 'ইমপোর্ট CSV' : 'Import CSV'}
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setActiveStudent(null);
              setFormData({
                fullName: '',
                banglaName: '',
                rollNo: students.length + 1,
                className: 'Class 10',
                sectionName: 'Section A (Padma)',
                gender: 'Male',
                bloodGroup: 'A+',
                guardianRelation: 'Father',
                status: 'Active',
                feeStatus: 'Paid',
                photoUrl: '',
              });
              setIsAddModalOpen(true);
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            {t.actions.addStudent}
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll, or admission ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Classes</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 6">Class 6</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>

        </div>
      </Card>

      {/* Students Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {t.common.noData}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{stu.rollNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.photoUrl}
                          alt={stu.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-500/30"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{stu.fullName}</p>
                          {stu.banglaName && (
                            <p className="font-bangla text-[11px] text-slate-500">{stu.banglaName}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {stu.admissionNo}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{stu.className}</p>
                      <p className="text-[10px] text-slate-500">{stu.sectionName}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-slate-900 dark:text-white font-medium">{stu.guardianName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{stu.guardianPhone}</p>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-600">{stu.attendanceRate}%</span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge 
                        variant={stu.feeStatus === 'Paid' ? 'emerald' : stu.feeStatus === 'Pending' ? 'amber' : 'rose'}
                        size="sm"
                      >
                        {stu.feeStatus}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setActiveStudent(stu);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveStudent(stu);
                            setFormData(stu);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(stu.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={activeStudent ? 'Edit Student Details' : 'Register New Student (Admission)'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
          {/* Photo Upload Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {isBangla ? 'শিক্ষার্থীর ছবি (Student Photo)' : 'Student Photo / Profile Picture'}
              </label>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photoUrl: '' })}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  {isBangla ? 'ছবি মুছুন' : 'Remove Photo'}
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Preview Avatar with quick upload button */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-sm bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Student preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera className="w-6 h-6 stroke-[1.5]" />
                      <span className="text-[10px] mt-1 font-medium">{isBangla ? 'ছবি নেই' : 'No photo'}</span>
                    </div>
                  )}
                </div>

                <label
                  htmlFor="student-photo-file"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                  title={isBangla ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload photo from device'}
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input
                  id="student-photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Photo Input Controls */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="student-photo-file-btn"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer transition-colors shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isBangla ? 'কম্পিউটার বা মোবাইল থেকে আপলোড' : 'Upload from Device (PC/Phone)'}</span>
                  </label>
                  <input
                    id="student-photo-file-btn"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-[11px] text-slate-400">{isBangla ? 'অথবা ওয়েব লিংক:' : 'or Image URL:'}</span>
                </div>

                {/* URL Input */}
                <div className="relative">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="url"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://... direct image link"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {isBangla ? 'রেডিমেড অবতার:' : 'Preset Avatars:'}
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {STUDENT_AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: preset.url })}
                        className={`w-6 h-6 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          formData.photoUrl === preset.url
                            ? 'ring-2 ring-emerald-500 border-white scale-110 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Full Name (English) *</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                placeholder="e.g. Tanvir Ahmed"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">বাংলা নাম (Bangla Name)</label>
              <input
                type="text"
                value={formData.banglaName || ''}
                onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bangla"
                placeholder="যেমন: তানভীর আহমেদ"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Class</label>
              <select
                value={formData.className || 'Class 10'}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 6">Class 6</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Section</label>
              <input
                type="text"
                value={formData.sectionName || 'Section A (Padma)'}
                onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Roll Number</label>
              <input
                type="number"
                value={formData.rollNo || 1}
                onChange={(e) => setFormData({ ...formData, rollNo: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup || 'A+'}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Guardian Name *</label>
              <input
                type="text"
                required
                value={formData.guardianName || ''}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                placeholder="e.g. Belal Hossain"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Guardian Phone *</label>
              <input
                type="text"
                required
                value={formData.guardianPhone || ''}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                placeholder="+880 1711-XXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Residential Address</label>
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Student Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Full Student Profile Modal */}
      {activeStudent && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Student Profile & Academic Record"
          maxWidth="xl"
        >
          <div className="space-y-6 text-xs">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={activeStudent.photoUrl}
                alt={activeStudent.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeStudent.fullName}</h3>
                  <Badge variant="emerald">{activeStudent.status}</Badge>
                </div>
                {activeStudent.banglaName && (
                  <p className="font-bangla text-slate-500 text-xs">{activeStudent.banglaName}</p>
                )}
                <p className="text-slate-500 mt-1">
                  ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{activeStudent.admissionNo}</span> • Roll: <strong>{activeStudent.rollNo}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Academic Details</p>
                <p><span className="text-slate-500">Class:</span> <strong>{activeStudent.className}</strong></p>
                <p><span className="text-slate-500">Section:</span> <strong>{activeStudent.sectionName}</strong></p>
                <p><span className="text-slate-500">Attendance:</span> <strong className="text-emerald-600">{activeStudent.attendanceRate}%</strong></p>
                <p><span className="text-slate-500">Fee Status:</span> <strong>{activeStudent.feeStatus}</strong></p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Guardian & Contact</p>
                <p><span className="text-slate-500">Guardian:</span> <strong>{activeStudent.guardianName} ({activeStudent.guardianRelation})</strong></p>
                <p><span className="text-slate-500">Phone:</span> <strong>{activeStudent.guardianPhone}</strong></p>
                <p><span className="text-slate-500">Blood Group:</span> <strong>{activeStudent.bloodGroup}</strong></p>
                <p><span className="text-slate-500">Address:</span> <span>{activeStudent.address}</span></p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import Students from CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={isBangla ? 'সিএসভি (CSV) ফাইল থেকে শিক্ষার্থী ইমপোর্ট' : 'Bulk Import Students from CSV'}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {/* Instructions and Download Template */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  {isBangla ? 'এক্সেল বা সিএসভি ফরম্যাট' : 'Standard CSV File Format'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBangla 
                    ? 'সহজে ডেটা সাজাতে আমাদের প্রস্তুতকৃত নমুনা টেমপ্লেটটি ডাউনলোড করে পূরণ করুন' 
                    : 'Download the pre-formatted sample template, fill it in Excel/Sheets, and upload.'}
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownloadTemplate}
              icon={<Download className="w-3.5 h-3.5 text-emerald-600" />}
              className="shrink-0"
            >
              {isBangla ? 'নমুনা টেমপ্লেট' : 'Download Sample CSV'}
            </Button>
          </div>

          {/* Upload Area */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center hover:border-emerald-500 transition-colors">
            <input
              id="student-csv-file-input"
              type="file"
              accept=".csv,text/csv"
              onChange={handleCSVFileChange}
              className="hidden"
            />
            <label
              htmlFor="student-csv-file-input"
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">
                {importFileName ? importFileName : (isBangla ? 'আপনার ডিভাইসের .CSV ফাইল নির্বাচন করুন' : 'Click to select .CSV file')}
              </p>
              <p className="text-[11px] text-slate-400">
                {isBangla ? 'সাপোর্টেড ফরম্যাট: .csv (UTF-8)' : 'Supported format: Comma Separated Values (.csv)'}
              </p>
            </label>
          </div>

          {/* Error Message */}
          {importError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{importError}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {importPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {isBangla 
                      ? `${importPreview.length} জন শিক্ষার্থীর তথ্য পাওয়া গেছে:` 
                      : `Found ${importPreview.length} students ready to import:`}
                  </span>
                </p>
                <span className="text-[10px] text-slate-400">Showing first {Math.min(5, importPreview.length)} rows</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Roll</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Class & Section</th>
                      <th className="py-2 px-3">Guardian</th>
                      <th className="py-2 px-3">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {importPreview.slice(0, 5).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-1.5 px-3 font-mono font-bold text-emerald-600">{s.rollNo}</td>
                        <td className="py-1.5 px-3 font-medium text-slate-900 dark:text-white">{s.fullName}</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300">{s.className} ({s.sectionName})</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300">{s.guardianName}</td>
                        <td className="py-1.5 px-3 font-mono text-slate-500">{s.guardianPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={importPreview.length === 0}
              onClick={handleConfirmImport}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              {isBangla ? `${importPreview.length} জন শিক্ষার্থী ইমপোর্ট করুন` : `Import ${importPreview.length} Students`}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
