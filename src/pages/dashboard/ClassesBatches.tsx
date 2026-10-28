import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { AcademicClass, Section } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Layers, Plus, Users, DoorOpen, UserCheck, BookOpen } from 'lucide-react';

export const ClassesBatches: React.FC = () => {
  const { t } = useLanguage();
  const [classes, setClasses] = useState<AcademicClass[]>(() => StorageService.getClasses());
  const [sections, setSections] = useState<Section[]>(() => StorageService.getSections());
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  const [secName, setSecName] = useState('');
  const [secClass, setSecClass] = useState('Class 10');
  const [secRoom, setSecRoom] = useState('Room 208');
  const [secTeacher, setSecTeacher] = useState('Dr. Rafiqul Islam');

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName) return;

    const newSec: Section = {
      id: `sec-${Date.now()}`,
      classId: 'c10',
      className: secClass,
      name: secName,
      capacity: 45,
      roomNumber: secRoom,
      classTeacherName: secTeacher,
      studentCount: 36,
    };

    const updated = StorageService.addSection(newSec);
    setSections(updated);
    setIsAddSectionOpen(false);
    setSecName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.batchManagement} & Classes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic grade levels, sections (Padma, Meghna, Jamuna), rooms, and class teachers
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddSectionOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add New Section / Batch
        </Button>
      </div>

      {/* Grade Levels Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {classes.map((c) => (
          <Card key={c.id} className="border-t-4 border-t-brand-600 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {c.code}
              </span>
              <Badge variant="emerald" size="sm">{c.sectionsCount} Sections</Badge>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{c.name}</h3>
            <p className="text-xs text-slate-500 font-medium">Enrolled: <strong>{c.totalStudents}</strong> Students</p>
          </Card>
        ))}
      </div>

      {/* Active Sections Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Sections & Class Batches</h3>
          <span className="text-xs text-slate-500">Academic Year 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Section Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Room Allocation</th>
                <th className="py-3 px-4">Assigned Class Teacher</th>
                <th className="py-3 px-4 text-center">Enrolled Students</th>
                <th className="py-3 px-4 text-center">Capacity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sections.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {sec.name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-brand-700 dark:text-brand-300">
                    {sec.className}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                    {sec.roomNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                    {sec.classTeacherName}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {sec.studentCount}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {sec.capacity} seats
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="emerald" size="sm">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        title="Add New Section / Batch"
        maxWidth="md"
      >
        <form onSubmit={handleAddSection} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Section Name *</label>
            <input
              type="text"
              required
              value={secName}
              onChange={(e) => setSecName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              placeholder="e.g. Section C (Karnafuli)"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Class</label>
            <select
              value={secClass}
              onChange={(e) => setSecClass(e.target.value)}
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
            <label className="block font-semibold mb-1">Assigned Room</label>
            <input
              type="text"
              value={secRoom}
              onChange={(e) => setSecRoom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Class Teacher</label>
            <input
              type="text"
              value={secTeacher}
              onChange={(e) => setSecTeacher(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Section
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
