import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Quote } from 'lucide-react';

export const PrincipalMessage: React.FC = () => {
  const { school } = useSchool();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <Badge variant="blue" size="md">Leadership Message</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Principal's Message to Students & Parents
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">{school.name}</p>
      </div>

      <Card className="p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
            alt="Principal"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-brand-500/30 shrink-0"
          />
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ms. Ria Sultana, M.Ed.</h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Principal & Chief Academic Officer</p>
            <p className="text-xs text-slate-500">Dhaka University Alumna • Certified Educational Technologist</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <Quote className="w-8 h-8 text-brand-500/30" />
          <p>
            Dear Parents, Guardians, and Esteemed Students,
          </p>
          <p>
            It is my distinct privilege to welcome you to <strong>{school.name}</strong>. In an era redefined by rapid technological breakthroughs and global transformation, education cannot remain confined to rote memorization. At Digital AI School, we have harmonized the rich values and rigor of the Bangladesh National Curriculum with the unprecedented potential of Artificial Intelligence.
          </p>
          <p>
            Our students do not just study science and literature; they engage with AI-driven diagnostic tutors, formulate original hypotheses in state-of-the-art laboratories, and learn ethical civic responsibility. We believe every child possesses innate genius that blooms when provided with empathy, structure, and world-class instructional tools.
          </p>
          <p>
            We invite you to partner with us as we empower the architects of Smart Bangladesh.
          </p>
          <div className="pt-4 font-serif text-slate-900 dark:text-white font-bold">
            <p>Ms. Ria Sultana</p>
            <p className="text-xs font-sans text-slate-500 font-normal">Principal, Digital AI School & College</p>
          </div>
        </div>
      </Card>

    </div>
  );
};
