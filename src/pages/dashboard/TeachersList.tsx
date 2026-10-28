import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Teacher } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Users, Plus, Search, Mail, Phone, BookOpen, UserCheck, Calendar } from 'lucide-react';

export const TeachersList: React.FC = () => {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    fullName: '',
    designation: 'Lecturer',
    department: 'Science & Mathematics',
    qualification: 'M.Sc. in Mathematics',
    phone: '+880 1711-000000',
    email: '',
    assignedClasses: ['Class 10'],
    assignedSubjects: ['General Mathematics'],
    status: 'Active',
  });

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

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
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };

    const updated = StorageService.addTeacher(newTeacher);
    setTeachers(updated);
    setIsAddModalOpen(false);
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
            Manage academic faculty, subject allocations, workloads and leave approvals
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          {t.actions.addTeacher}
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teacher by name, department, or designation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} hoverable className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/40"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {teacher.fullName}
                </h4>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium truncate">
                  {teacher.designation}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">{teacher.employeeId}</p>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 flex items-center gap-1.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{teacher.department}</span>
              </p>
              <p className="text-slate-500 flex items-center gap-1.5 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{teacher.phone}</span>
              </p>
              <p className="text-slate-500 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{teacher.email}</span>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400">Joined: {teacher.joiningDate}</span>
              <Badge variant={teacher.status === 'Active' ? 'emerald' : 'amber'} size="sm">
                {teacher.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Faculty / Teacher Profile"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName || ''}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              placeholder="e.g. Dr. Kamal Uddin"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Designation</label>
            <input
              type="text"
              value={formData.designation || ''}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Faculty Member
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
