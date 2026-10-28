import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Target, Eye, Award, BookOpen, Users } from 'lucide-react';

export const About: React.FC = () => {
  const { school } = useSchool();
  const { isBangla } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <Badge variant="emerald" size="md">About Our Institution</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pioneering Smart Education in Bangladesh
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {school.name} (EIIN: {school.eiinNumber}) is dedicated to merging ethical values, national heritage, and artificial intelligence-driven pedagogical rigor.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 space-y-4 border-t-4 border-t-brand-600">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            To provide every student with personalized, high-caliber education combining the Bangladesh National Curriculum with global 21st-century problem solving, AI literacy, and strong moral character.
          </p>
        </Card>

        <Card className="p-8 space-y-4 border-t-4 border-t-electric-600">
          <div className="w-12 h-12 rounded-2xl bg-electric-50 dark:bg-electric-950 text-electric-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            To be Bangladesh’s premier center of scholastic excellence and research-informed pedagogy, nurturing future leaders capable of shaping Smart Bangladesh 2041 and beyond.
          </p>
        </Card>
      </div>

      {/* Campus Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-2">
          <Award className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-bold text-base text-slate-900 dark:text-white">Academic Excellence</h4>
          <p className="text-xs text-slate-500">100% pass rate in JSC, SSC, and National Board Assessments with top talent scholarships.</p>
        </Card>

        <Card className="p-6 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-base text-slate-900 dark:text-white">Modern STEM & AI Labs</h4>
          <p className="text-xs text-slate-500">State-of-the-art physics, chemistry, biology, and robotics laboratories with interactive displays.</p>
        </Card>

        <Card className="p-6 text-center space-y-2">
          <Users className="w-8 h-8 text-blue-500 mx-auto" />
          <h4 className="font-bold text-base text-slate-900 dark:text-white">Holistic Development</h4>
          <p className="text-xs text-slate-500">Active debate society, cultural academy, sports leagues, science Olympiad teams, and ethics forum.</p>
        </Card>
      </div>

    </div>
  );
};
