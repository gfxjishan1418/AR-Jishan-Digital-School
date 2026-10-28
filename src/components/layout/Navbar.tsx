import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { Button } from '../ui/Button';
import { Menu, X, GraduationCap, ChevronRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPublicPage: string;
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPublicPage,
  onNavigate,
  onOpenLogin,
  onOpenDashboard,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'principal', label: t.nav.principal },
    { id: 'programs', label: t.nav.programs },
    { id: 'teachers', label: t.nav.teachers },
    { id: 'admissions', label: t.nav.admissions },
    { id: 'notices', label: t.nav.notices },
    { id: 'events', label: t.nav.events },
    { id: 'results', label: t.nav.results },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="Digital AI School"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/40 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Digital AI School
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-black bg-brand-600 text-white tracking-widest">
                  DAI
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Smart Education. Simple Management.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentPublicPage === link.id
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <LanguageToggle />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Button
              onClick={() => onNavigate('apply')}
              variant="outline"
              size="sm"
            >
              {t.nav.applyOnline}
            </Button>

            <Button
              onClick={onOpenDashboard}
              variant="primary"
              size="sm"
            >
              {t.nav.dashboard}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageToggle compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-150">
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentPublicPage === link.id
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Button
              onClick={() => {
                onNavigate('apply');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full"
            >
              {t.nav.applyOnline}
            </Button>
            <Button
              onClick={() => {
                onOpenDashboard();
                setMobileMenuOpen(false);
              }}
              variant="primary"
              className="w-full"
            >
              {t.nav.dashboard}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
