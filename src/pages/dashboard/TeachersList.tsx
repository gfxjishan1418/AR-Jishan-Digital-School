import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Teacher } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  Users, Plus, Search, Mail, Phone, BookOpen, 
  Camera, UploadCloud, Image as ImageIcon, Sparkles, 
  Edit, Trash2, Award, CheckCircle2 
} from 'lucide-react';

export const TeachersList: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);

  const TEACHER_AVATAR_PRESETS = [
    { label: 'Female 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
    { label: 'Male 1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    { label: 'Female 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
    { label: 'Male 2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
  ];

  const [formData, setFormData] = useState<Partial<Teacher>>({
    fullName: '',
    designation: 'Senior Lecturer',
    department: 'Science & Mathematics',
    qualification: 'M.Sc. in Mathematics',
    phone: '+880 1711-000000',
    email: '',
    assignedClasses: ['Class 10'],
    assignedSubjects: ['General Mathematics'],
    status: 'Active',
    avatarUrl: '',
  });

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.designation.toLowerCase().includes(search.toLowerCase())
  );

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
        setFormData(prev => ({ ...prev, avatarUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setActiveTeacher(null);
    setFormData({
      fullName: '',
      designation: 'Senior Lecturer',
      department: 'Science & Mathematics',
      qualification: 'M.Sc. in Mathematics',
      phone: '+880 1711-000000',
      email: '',
      assignedClasses: ['Class 10'],
      assignedSubjects: ['General Mathematics'],
      status: 'Active',
      avatarUrl: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setActiveTeacher(teacher);
    setFormData(teacher);
    setIsAddModalOpen(true);
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm(isBangla ? 'আপনি কি এই শিক্ষকের প্রোফাইল মুছে ফেলতে চান?' : 'Are you sure you want to delete this faculty profile?')) {
      const updated = teachers.filter(t => t.id !== id);
      StorageService.setTeachers(updated);
      setTeachers(updated);
    }
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert(isBangla ? 'শিক্ষকের নাম ও মোবাইল নম্বর পূরণ করুন' : 'Please provide Teacher Name and Phone Number');
      return;
    }

    if (activeTeacher) {
      const updatedTeacher: Teacher = {
        ...activeTeacher,
        ...formData as Teacher,
        avatarUrl: formData.avatarUrl || activeTeacher.avatarUrl || TEACHER_AVATAR_PRESETS[0].url,
      };
      const updated = StorageService.updateTeacher(updatedTeacher);
      setTeachers(updated);
    } else {
      const newTeacher: Teacher = {
        id: `tea-${Date.now()}`,
        employeeId: `TEA-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: formData.fullName,
        designation: formData.designation || 'Lecturer',
        department: formData.department || 'General',
        qualification: formData.qualification || 'M.A. / M.Sc.',
        phone: formData.phone,
        email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@digitalaischool.edu.bd`,
        assignedClasses: formData.assignedClasses || ['Class 10'],
        assignedSubjects: formData.assignedSubjects || ['General Science'],
        status: formData.status as any || 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        avatarUrl: formData.avatarUrl || TEACHER_AVATAR_PRESETS[0].url,
      };
      const updated = StorageService.addTeacher(newTeacher);
      setTeachers(updated);
    }

    setIsAddModalOpen(false);
    setActiveTeacher(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.teachers} & Staff Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic faculty, designations, photos, subject allocations and status
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenAdd}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          {t.actions.addTeacher}
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBangla ? 'শিক্ষকের নাম, বিভাগ বা পদবী দিয়ে অনুসন্ধান করুন...' : 'Search teacher by name, department, or designation...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} hoverable className="space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-sm"
                  />
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-lg shadow border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isBangla ? 'ছবি বা প্রোফাইল এডিট করুন' : 'Change photo / edit profile'}
                  >
                    <Camera className="w-3 h-3 text-emerald-600" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {teacher.fullName}
                  </h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold truncate">
                    {teacher.designation}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{teacher.employeeId}</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{teacher.department}</span>
                </p>
                {teacher.qualification && (
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{teacher.qualification}</span>
                  </p>
                )}
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{teacher.phone}</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{teacher.email}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <Badge variant={teacher.status === 'Active' ? 'emerald' : 'amber'} size="sm">
                {teacher.status}
              </Badge>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Teacher"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Delete Teacher"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setActiveTeacher(null);
        }}
        title={activeTeacher ? (isBangla ? 'শিক্ষকের তথ্য ও ছবি এডিট করুন' : 'Edit Faculty / Teacher Profile') : (isBangla ? 'নতুন শিক্ষক নিবন্ধন ও ছবি সংযুক্তি' : 'Add New Faculty Member')}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          
          {/* Teacher Photo Upload Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {isBangla ? 'শিক্ষকের ছবি (Teacher Photo / Avatar)' : 'Faculty Photo / Profile Avatar'}
              </label>
              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  {isBangla ? 'ছবি মুছুন' : 'Remove Photo'}
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Preview Avatar with camera button */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-sm bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Teacher preview"
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
                  htmlFor="teacher-photo-file"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                  title={isBangla ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload photo from device'}
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input
                  id="teacher-photo-file"
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
                    htmlFor="teacher-photo-file-btn"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer transition-colors shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isBangla ? 'কম্পিউটার বা মোবাইল থেকে আপলোড' : 'Upload from Device (PC/Phone)'}</span>
                  </label>
                  <input
                    id="teacher-photo-file-btn"
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
                    value={formData.avatarUrl || ''}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
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
                    {TEACHER_AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                        className={`w-6 h-6 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          formData.avatarUrl === preset.url
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
              <label className="block font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Dr. Kamal Uddin"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Senior Lecturer / Head of Dept"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Department</label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Science & Mathematics"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. M.Sc. in Physics (DU)"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Phone *</label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="+880 1711-XXXXXX"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="teacher@digitalaischool.edu.bd"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setActiveTeacher(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {activeTeacher ? (isBangla ? 'আপডেট সংরক্ষণ করুন' : 'Update Faculty Record') : (isBangla ? 'শিক্ষক সংরক্ষণ করুন' : 'Save Faculty Member')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
