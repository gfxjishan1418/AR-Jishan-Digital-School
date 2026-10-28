import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AiAssistantModal } from '../ai/AiAssistantModal';
import { Modal } from '../ui/Modal';
import { Search, GraduationCap, Users, BookOpen, CreditCard, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateHome: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  onNavigateHome,
}) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick search shortcut (⌘K or Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchShortcuts = [
    { label: 'Students Roster', tab: 'students', icon: GraduationCap },
    { label: 'Teachers & Staff', tab: 'teachers', icon: Users },
    { label: 'Daily Attendance Sheet', tab: 'attendance', icon: BookOpen },
    { label: 'Fee Management & Invoices', tab: 'fees', icon: CreditCard },
    { label: 'Exam Results & Marksheets', tab: 'examinations', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAiChat={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        
        {/* Topbar */}
        <Topbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateHome={onNavigateHome}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Chat Bot Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Global Command / Search Palette Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Quick Navigation & Global Search"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything or jump to module..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Modules & Quick Jump
            </p>
            {searchShortcuts.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.tab}
                  onClick={() => {
                    onSelectTab(s.tab);
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium hover:bg-brand-50 dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-brand-300 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>{s.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Jump</span>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

    </div>
  );
};
