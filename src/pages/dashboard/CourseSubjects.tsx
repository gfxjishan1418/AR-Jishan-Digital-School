import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { Subject } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AiLessonPlanner } from '../../components/ai/AiLessonPlanner';
import { AiQuizGenerator } from '../../components/ai/AiQuizGenerator';
import { BookMarked, Plus, Sparkles, BookOpen, Layers } from 'lucide-react';

export const CourseSubjects: React.FC = () => {
  const { t, isBangla } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeAiTool, setActiveAiTool] = useState<'none' | 'planner' | 'quiz'>('none');

  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subClass, setSubClass] = useState('Class 10');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      classId: 'c10',
      className: subClass,
      name: subName,
      code: subCode,
      batchesCount: 5,
      studentsCount: 140,
      status: 'Active',
      fullMarks: 100,
      passMarks: 33,
    };

    const updated = StorageService.addSubject(newSub);
    setSubjects(updated);
    setIsAddOpen(false);
    setSubName('');
    setSubCode('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.courseManagement} & Curriculum
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            NCTB national curriculum subjects, pass criteria, and embedded AI pedagogical tools
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveAiTool(activeAiTool === 'planner' ? 'none' : 'planner')}
            icon={<Sparkles className="w-3.5 h-3.5 text-brand-600" />}
          >
            {activeAiTool === 'planner' ? 'Hide Lesson Planner' : 'AI Lesson Planner'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveAiTool(activeAiTool === 'quiz' ? 'none' : 'quiz')}
            icon={<Sparkles className="w-3.5 h-3.5 text-electric-600" />}
          >
            {activeAiTool === 'quiz' ? 'Hide Quiz Gen' : 'AI Quiz Generator'}
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* Embedded AI Tool Drawer if activated */}
      {activeAiTool === 'planner' && (
        <Card className="border-2 border-brand-500/50 bg-gradient-to-r from-brand-50/20 via-white to-brand-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Lesson Plan Generator (NCTB Aligned)</h3>
            </div>
            <button onClick={() => setActiveAiTool('none')} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>
          <AiLessonPlanner />
        </Card>
      )}

      {activeAiTool === 'quiz' && (
        <Card className="border-2 border-electric-500/50 bg-gradient-to-r from-sky-50/20 via-white to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-electric-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Assessment & Quiz Generator</h3>
            </div>
            <button onClick={() => setActiveAiTool('none')} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>
          <AiQuizGenerator />
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <Card key={s.id} hoverable className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {s.code}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">{s.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{s.className}</p>
              </div>
              <Badge variant="emerald" size="sm">{s.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400">Total Marks</p>
                <p className="font-bold text-slate-900 dark:text-white">{s.fullMarks} (Pass: {s.passMarks})</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400">Enrolled</p>
                <p className="font-bold text-slate-900 dark:text-white">{s.studentsCount} Students</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Subject to Curriculum"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              placeholder="e.g. Higher Mathematics"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Subject Code *</label>
            <input
              type="text"
              required
              value={subCode}
              onChange={(e) => setSubCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              placeholder="e.g. HMATH107"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Class Level</label>
            <select
              value={subClass}
              onChange={(e) => setSubClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Subject
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
