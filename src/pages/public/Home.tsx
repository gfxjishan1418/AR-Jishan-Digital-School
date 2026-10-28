import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSchool } from '../../context/SchoolContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  Sparkles, GraduationCap, Users, Award, ShieldCheck, 
  ArrowRight, BookOpen, CheckCircle2, ChevronRight, Brain, 
  Laptop, Calendar, Phone, Heart 
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenDashboard: () => void;
  onOpenAiAssistant: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onOpenDashboard,
  onOpenAiAssistant,
}) => {
  const { t, isBangla } = useLanguage();
  const { school } = useSchool();

  const features = [
    {
      title: isBangla ? 'স্মার্ট এআই লার্নিং অ্যাসিস্ট্যান্ট' : 'Built-in Nova AI Learning Assistant',
      desc: isBangla ? 'শিক্ষার্থীদের জন্য ২৪/৭ দ্বিভাষিক প্রাইভেট টিউটরিং এবং শিক্ষকদের জন্য সেকেন্ডের মধ্যে এনসিটিবি লেসন প্ল্যানার।' : '24/7 bilingual concept explanation for students, automatic NCTB lesson planning & instant quiz generator for teachers.',
      icon: Brain,
      color: 'bg-emerald-500',
    },
    {
      title: isBangla ? 'স্বয়ংক্রিয় ডিজিটাল হাজিরা ও এসএমএস' : 'Automated Attendance & SMS Alerts',
      desc: isBangla ? 'এক ক্লিকে হাজিরা গ্রহণ ও অভিভাবকদের কাছে রিয়েল-টাইম এসএমএস বার্তা পৌঁছে দেওয়ার স্বয়ংক্রিয় ব্যবস্থা।' : 'Single-tap attendance logging with automated parent SMS dispatch, monthly percentage analysis & audit trail.',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: isBangla ? 'বিকাশ ও নগদে ডিজিটাল ফি আদায়' : 'bKash & Nagad Integrated Invoicing',
      desc: isBangla ? 'অনলাইন ও অফলাইনে ফি জমা, অটোমেটিক রসিদ জেনারেশন ও এআই বকেয়া ফি ঝুঁকি পূর্বাভাস।' : 'Collect fees via Bangladesh mobile financial services, generate stamped printable vouchers & predict defaulter risks.',
      icon: CreditCardIcon,
      color: 'bg-amber-500',
    },
    {
      title: isBangla ? 'বোর্ড স্ট্যান্ডার্ড গ্রেডিং ও মার্কশিট' : 'Board Standard GPA 5.0 Gradebook',
      desc: isBangla ? 'ঢাকা শিক্ষা বোর্ডের নিয়মানুযায়ী জিপিএ ৫.০ গ্রেডিং স্কেল এবং এক ক্লিকে প্রিন্টযোগ্য একাডেমিক রিপোর্ট কার্ড।' : 'Official National Board 5.0 GPA calculation, subject-wise marks entry, printable transcripts & online lookup.',
      icon: Award,
      color: 'bg-purple-500',
    },
  ];

  function CreditCardIcon(props: any) {
    return <Award {...props} />;
  }

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-14 sm:pt-16 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold animate-in fade-in duration-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                <span>{t.home.heroBadge}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {isBangla ? (
                  <>
                    স্মার্ট শিক্ষা। সহজ পরিচালনা। <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                      উন্নত ডিজিটাল ভবিষ্যৎ।
                    </span>
                  </>
                ) : (
                  <>
                    Smart Education. Simple Management. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-electric-600">
                      Better Learning.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.home.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => onNavigate('apply')}
                  icon={<GraduationCap className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-lg shadow-brand-600/20"
                >
                  {t.home.ctaApply}
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onOpenDashboard}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {t.home.ctaLogin}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={onOpenAiAssistant}
                  icon={<Sparkles className="w-4 h-4 text-brand-600" />}
                  className="w-full sm:w-auto"
                >
                  {t.home.tryAiTutor}
                </Button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  EIIN: 134892 (Dhaka Board)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  NCTB Curriculum Compliant
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Multi-Tenant SaaS
                </span>
              </div>

            </div>

            {/* Right Hero Visual (5 cols) — Showcase the Official Logo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Glowing halo */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 via-electric-500 to-brand-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse" />
                
                {/* Logo Frame */}
                <div className="relative bg-white p-4 rounded-3xl border-4 border-brand-500/40 shadow-2xl flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="AR Jishan Digital School & College"
                    className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl object-contain group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Authorized Data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center p-6 border-b-4 border-b-brand-600">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">1,248</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t.home.statsStudents}</p>
          </Card>

          <Card className="text-center p-6 border-b-4 border-b-emerald-600">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">86</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t.home.statsTeachers}</p>
          </Card>

          <Card className="text-center p-6 border-b-4 border-b-blue-600">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">99.2%</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t.home.statsPassRate}</p>
          </Card>

          <Card className="text-center p-6 border-b-4 border-b-amber-600">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">15+</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t.home.statsAcheivements}</p>
          </Card>
        </div>
      </section>

      {/* 3. WHY CHOOSE AR JISHAN DIGITAL SCHOOL & COLLEGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.whyChooseTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.home.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} hoverable className="space-y-4 p-6">
                <div className={`w-12 h-12 rounded-2xl ${f.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. AI-ASSISTED LEARNING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white p-8 sm:p-12 border border-brand-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Educational AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.home.aiBannerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-brand-100/90 leading-relaxed max-w-2xl">
                {t.home.aiBannerDesc}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  size="md"
                  variant="primary"
                  onClick={onOpenAiAssistant}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Launch Nova AI Bot
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => onNavigate('programs')}
                >
                  Explore Academic Programs
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 max-w-xs">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto">
                  <Laptop className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">Smart Classroom Ready</h4>
                <p className="text-[11px] text-brand-200">
                  Seamlessly integrates with interactive boards, student tablets, and mobile smartphones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC PROGRAMS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Academic Programs & Batches
            </h2>
            <p className="text-xs text-slate-500">From Junior Secondary to Senior SSC Examination Batches</p>
          </div>
          <button
            onClick={() => onNavigate('programs')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All Programs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card hoverable onClick={() => onNavigate('programs')} className="space-y-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Classes 6, 7 & 8
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Junior Secondary Division</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Foundational English, Bangla, Mathematics, Integrated Science, ICT and moral education according to the latest NCTB curriculum.
            </p>
          </Card>

          <Card hoverable onClick={() => onNavigate('programs')} className="space-y-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Classes 9 & 10 (Science)
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Secondary Science Stream</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Physics, Chemistry, Biology, Higher Mathematics, and ICT with hands-on modern lab experiments and Olympiad preparation.
            </p>
          </Card>

          <Card hoverable onClick={() => onNavigate('programs')} className="space-y-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Classes 9 & 10 (Commerce & Arts)
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Business Studies & Humanities</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Accounting, Finance & Banking, Business Entrepreneurship, Economics, and Bangladesh Studies with real-world case simulations.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. CALL TO ACTION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Admissions Open for Academic Session 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Apply online in minutes, track your application code, and join Bangladesh’s premier AI-enabled learning institution.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button size="lg" variant="primary" onClick={() => onNavigate('apply')}>
              {t.home.ctaApply}
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('track')}>
              {t.nav.trackApplication}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
