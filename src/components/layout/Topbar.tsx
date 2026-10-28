import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { 
  Search, Bell, MessageSquare, Sun, Moon, Menu, 
  ExternalLink, LogOut, CheckCircle2, AlertTriangle, Info 
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onNavigateHome: () => void;
  onOpenSearch: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  onNavigateHome,
  onOpenSearch,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dai_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const notifications = [
    { id: 1, title: 'Fee payment pending for 42 students', time: '2 min ago', type: 'alert', unread: true },
    { id: 2, title: '5 admission inquiries need follow-up today', time: '15 min ago', type: 'info', unread: true },
    { id: 3, title: 'Exam schedule published for Class 10', time: '1 hour ago', type: 'success', unread: true },
    { id: 4, title: 'Server backup completed successfully at 02:00 AM', time: '2 hours ago', type: 'success', unread: false },
    { id: 5, title: 'Class 8B Science Lab timetable updated', time: '3 hours ago', type: 'info', unread: false },
    { id: 6, title: 'bKash gateway webhook received ৳12,500', time: '4 hours ago', type: 'success', unread: true },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 h-16 px-4 lg:px-8 flex items-center justify-between transition-colors">
      
      {/* Left: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (with ⌘K) */}
        <div 
          onClick={onOpenSearch}
          className="w-full max-w-md hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 cursor-pointer transition-all"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">
            {t.dashboard.searchPlaceholder}
          </span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-2xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Public Website Button */}
        <button
          onClick={onNavigateHome}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 rounded-xl transition-all border border-brand-200 dark:border-brand-800"
        >
          <span>{t.nav.home}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Language Switcher */}
        <LanguageToggle />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              6
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.dashboard.alertsNotifications}
                  </h4>
                  <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3">
                      {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
                      {n.type === 'info' && <Info className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight">
                          {n.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Message Bubble Icon */}
        <button 
          onClick={onOpenSearch}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* User Profile Pill (Ms. Ria Administrator) */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all border border-slate-200/60 dark:border-slate-700"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-500"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {user.designation || 'Administrator'}
              </p>
            </div>
          </button>

          {showUserDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await logout();
                      onNavigateHome();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out & Lock Session</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
};
