import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, CheckCircle2, Award, Clock } from 'lucide-react';

export const Programs: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { school } = useSchool();

  const programs = [
    {
      title: 'Junior Secondary (Classes 6 to 8)',
      category: 'Foundation Tier',
      description: 'Comprehensive general foundation covering Bangla, English, Mathematics, Integrated Science, Social Studies, ICT, and Religious/Moral Studies.',
      features: ['NCTB Curriculum alignment', 'English language immersion', 'STEM hands-on project days', 'Weekly formative diagnostics'],
      badge: 'Classes 6 - 8'
    },
    {
      title: 'Secondary SSC — Science Division',
      category: 'STEM Excellence',
      description: 'Rigorous preparation for SSC Board Examinations featuring Physics, Chemistry, Biology, Higher Mathematics, and ICT with specialized practical sessions.',
      features: ['Dedicated Physics, Chemistry & Bio labs', 'Bangla & English version options', 'Board model exams & solution classes', 'AI question bank & quiz bank'],
      badge: 'Classes 9 & 10'
    },
    {
      title: 'Secondary SSC — Business Studies',
      category: 'Commerce & Enterprise',
      description: 'Practical foundation in Accounting, Finance & Banking, Business Entrepreneurship, Economics, and Information Technology.',
      features: ['Financial literacy workshops', 'Case study seminars', 'Computerized accounting labs', 'Board preparation intensives'],
      badge: 'Classes 9 & 10'
    },
    {
      title: 'Secondary SSC — Humanities',
      category: 'Arts & Social Thought',
      description: 'In-depth study of Geography & Environment, History of Bangladesh & World Civilization, Civics, and Literature.',
      features: ['Debate & public speaking', 'Historical research projects', 'Creative writing workshops', 'Civic awareness seminars'],
      badge: 'Classes 9 & 10'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="md">NCTB & Modern Curriculum</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Academic Programs & Class Levels
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Tailored learning pathways engineered for intellectual mastery, character development, and board exam success.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog, idx) => (
          <Card key={idx} className="p-8 space-y-4 border-l-4 border-l-brand-600 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {prog.category}
                </span>
                <Badge variant="blue" size="sm">{prog.badge}</Badge>
              </div>

              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                {prog.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {prog.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {prog.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('apply')}
              >
                Apply for this Program
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
