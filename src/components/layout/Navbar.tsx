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

  // Primary navigation links centered on desktop
  const desktopNavLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'programs', label: t.nav.programs },
    { id: 'teachers', label: t.nav.teachers },
    { id: 'admissions', label: t.nav.admissions },
    { id: 'results', label: t.nav.results },
    { id: 'notices', label: t.nav.notices },
    { id: 'contact', label: t.nav.contact },
  ];

  // All navigation links for mobile drawer
  const allNavLinks = [
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
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Left: Brand & Official Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <img
              src="/logo.png"
              alt="AR Jishan Digital School & College"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white ring-2 ring-brand-500/40 group-hover:scale-105 transition-transform p-0.5 shadow-sm shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                {t.brandName}
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* 2. Center: Centered Clean Navigation Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-2">
            <div className="flex items-center gap-1 xl:gap-1.5 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              {desktopNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentPublicPage === link.id
                      ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Right: Action Buttons & ERP Access */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <LanguageToggle />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Button
              onClick={() => onNavigate('apply')}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex whitespace-nowrap"
            >
              {t.nav.applyOnline}
            </Button>

            <Button
              onClick={onOpenDashboard}
              variant="primary"
              size="sm"
              className="shadow-sm font-bold whitespace-nowrap"
              icon={<GraduationCap className="w-4 h-4" />}
            >
              {t.nav.dashboard}
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-150 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {allNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                  currentPublicPage === link.id
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <Button
              onClick={() => {
                onNavigate('apply');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {t.nav.applyOnline}
            </Button>
            <Button
              onClick={() => {
                onOpenDashboard();
                setMobileMenuOpen(false);
              }}
              variant="primary"
              size="sm"
              className="flex-1"
              icon={<GraduationCap className="w-4 h-4" />}
            >
              {t.nav.dashboard}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
