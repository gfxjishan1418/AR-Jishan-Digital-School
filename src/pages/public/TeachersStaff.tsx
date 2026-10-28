import React from 'react';
import { StorageService } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Phone, Mail, Award } from 'lucide-react';

export const TeachersStaff: React.FC = () => {
  const teachers = StorageService.getTeachers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      
      <div className="text-center space-y-2">
        <Badge variant="blue" size="md">Distinguished Faculty</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Our Qualified Educators & Mentors
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Passionate scholars and trained pedagogues dedicated to nurturing each student's potential.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teachers.map((t) => (
          <Card key={t.id} hoverable className="text-center p-6 space-y-3">
            <img
              src={t.avatarUrl}
              alt={t.fullName}
              className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-brand-500/30"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t.fullName}</h3>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{t.designation}</p>
              <p className="text-[11px] text-slate-500 mt-1">{t.department}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              {t.qualification}
            </div>

            <p className="text-[10px] text-slate-400">
              Assigned: {t.assignedSubjects.join(', ')}
            </p>
          </Card>
        ))}
      </div>

    </div>
  );
};
