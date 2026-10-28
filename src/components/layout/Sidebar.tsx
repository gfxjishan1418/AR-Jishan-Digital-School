import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, GraduationCap, CalendarCheck, BookOpen, 
  Layers, UserPlus, CreditCard, Award, Clock, FileText, 
  BookMarked, MessageSquare, BarChart3, Settings, UserCog, 
  Zap, ShieldAlert, Sparkles, Bot, ChevronRight, X 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAiChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAiChat,
}) => {
  const { t } = useLanguage();
  const { role } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t.modules.dashboard, icon: LayoutDashboard },
    { id: 'classes', label: t.modules.myClasses, icon: BookOpen },
    { id: 'students', label: t.modules.students, icon: GraduationCap },
    { id: 'teachers', label: t.modules.teachers, icon: Users },
    { id: 'attendance', label: t.modules.attendance, icon: CalendarCheck },
    { id: 'courses', label: t.modules.courseManagement, icon: BookMarked },
    { id: 'batches', label: t.modules.batchManagement, icon: Layers },
    { id: 'admissions', label: t.modules.admissions, icon: UserPlus },
    { id: 'fees', label: t.modules.feeManagement, icon: CreditCard },
    { id: 'examinations', label: t.modules.examinations, icon: Award },
    { id: 'timetable', label: t.modules.timetable, icon: Clock },
    { id: 'homework', label: t.modules.homework, icon: FileText },
    { id: 'library', label: t.modules.library, icon: BookOpen },
    { id: 'communication', label: t.modules.communication, icon: MessageSquare },
    { id: 'reports', label: t.modules.reportsAnalytics, icon: BarChart3 },
    { id: 'settings', label: t.modules.systemSettings, icon: Settings },
    { id: 'users', label: t.modules.userManagement, icon: UserCog },
    { id: 'integrations', label: t.modules.integrations, icon: Zap },
    { id: 'audit', label: t.modules.auditLogs, icon: ShieldAlert },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      
      {/* Brand Header */}
      <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Digital AI School" 
            className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-brand-500/30" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Digital AI School
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Education Management</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Campus Session Pill */}
      <div className="px-4 py-2.5">
        <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold leading-tight">Digital AI School ERP</p>
            <p className="text-[11px] text-brand-100 font-medium">Session 2026 • Term 1</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold border-l-4 border-brand-600 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              }`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Floating AI Assistant Widget (bottom-left) */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white border border-brand-500/30 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-brand-500/20 blur-xl group-hover:bg-brand-500/40 transition-all" />
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/30 flex items-center justify-center border border-brand-400/40">
              <Bot className="w-4 h-4 text-brand-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                Nova AI ERP
                <Sparkles className="w-3 h-3 text-amber-300" />
              </p>
              <p className="text-[10px] text-brand-200">AI Assistant for Decision Making</p>
            </div>
          </div>

          <button
            onClick={onOpenAiChat}
            className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat with Nova AI</span>
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
