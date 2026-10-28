import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';

// Layouts
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AiAssistantModal } from './components/ai/AiAssistantModal';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { PrincipalMessage } from './pages/public/PrincipalMessage';
import { Programs } from './pages/public/Programs';
import { TeachersStaff } from './pages/public/TeachersStaff';
import { AdmissionApply } from './pages/public/AdmissionApply';
import { AdmissionTrack } from './pages/public/AdmissionTrack';
import { ResultsLookup } from './pages/public/ResultsLookup';
import { Notices } from './pages/public/Notices';
import { EventsCalendar } from './pages/public/EventsCalendar';
import { Contact } from './pages/public/Contact';
import { PrivacyTerms } from './pages/public/PrivacyTerms';
import { Login } from './pages/public/Login';

// Dashboard Pages
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { StudentsList } from './pages/dashboard/StudentsList';
import { TeachersList } from './pages/dashboard/TeachersList';
import { AttendanceManager } from './pages/dashboard/AttendanceManager';
import { ClassesBatches } from './pages/dashboard/ClassesBatches';
import { CourseSubjects } from './pages/dashboard/CourseSubjects';
import { FeeManagement } from './pages/dashboard/FeeManagement';
import { Examinations } from './pages/dashboard/Examinations';
import { AdmissionsManager } from './pages/dashboard/AdmissionsManager';
import { Timetable } from './pages/dashboard/Timetable';
import { CommunicationNotice } from './pages/dashboard/CommunicationNotice';
import { ReportsAnalytics } from './pages/dashboard/ReportsAnalytics';
import { SystemSettings } from './pages/dashboard/SystemSettings';
import { AuditSecurity } from './pages/dashboard/AuditSecurity';
import { StudentPortal } from './pages/dashboard/StudentPortal';
import { ParentPortal } from './pages/dashboard/ParentPortal';

const AppContent: React.FC = () => {
  const { role } = useAuth();

  // Read initial view and page from URL parameters or hash
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    
    const isDashboard = params.get('view') === 'dashboard' || hash === 'dashboard';
    const page = params.get('page') || (hash && hash !== 'dashboard' ? hash : 'home');
    const tab = params.get('tab') || 'dashboard';

    return {
      initialView: (isDashboard ? 'dashboard' : 'public') as 'public' | 'dashboard',
      initialPage: page,
      initialTab: tab,
    };
  };

  const initialState = getInitialState();
  const [view, setView] = useState<'public' | 'dashboard'>(initialState.initialView);
  const [publicPage, setPublicPage] = useState<string>(initialState.initialPage);
  const [dashboardTab, setDashboardTab] = useState<string>(initialState.initialTab);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Sync URL when navigating public pages
  const handleNavigatePublic = (page: string) => {
    setPublicPage(page);
    setView('public');
    const url = page === 'home' ? '/' : `/?view=public&page=${page}`;
    window.history.pushState(null, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync URL when navigating to dashboard
  const handleOpenDashboard = (tab?: any) => {
    const targetTab = (typeof tab === 'string' && tab) ? tab : 'dashboard';
    setDashboardTab(targetTab);
    setView('dashboard');
    window.history.pushState(null, '', `/?view=dashboard${targetTab !== 'dashboard' ? `&tab=${targetTab}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDashboardTab = (tab: any) => {
    const targetTab = (typeof tab === 'string' && tab) ? tab : 'dashboard';
    setDashboardTab(targetTab);
    window.history.pushState(null, '', `/?view=dashboard${targetTab !== 'dashboard' ? `&tab=${targetTab}` : ''}`);
  };

  // Sync state if user clicks browser Back/Forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const state = getInitialState();
      setView(state.initialView);
      setPublicPage(state.initialPage);
      setDashboardTab(state.initialTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Render Public Website
  if (view === 'public') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors">
        <Navbar
          currentPublicPage={publicPage}
          onNavigate={handleNavigatePublic}
          onOpenLogin={() => handleNavigatePublic('login')}
          onOpenDashboard={handleOpenDashboard}
        />

        <main className="flex-1">
          {publicPage === 'home' && (
            <Home
              onNavigate={handleNavigatePublic}
              onOpenDashboard={handleOpenDashboard}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
            />
          )}
          {publicPage === 'about' && <About />}
          {publicPage === 'principal' && <PrincipalMessage />}
          {publicPage === 'programs' && <Programs onNavigate={handleNavigatePublic} />}
          {publicPage === 'teachers' && <TeachersStaff />}
          {(publicPage === 'admissions' || publicPage === 'apply') && (
            <AdmissionApply onNavigate={handleNavigatePublic} />
          )}
          {publicPage === 'track' && <AdmissionTrack onNavigate={handleNavigatePublic} />}
          {publicPage === 'results' && <ResultsLookup />}
          {publicPage === 'notices' && <Notices />}
          {publicPage === 'events' && <EventsCalendar />}
          {publicPage === 'contact' && <Contact />}
          {publicPage === 'privacy' && <PrivacyTerms />}
          {publicPage === 'login' && (
            <Login
              onSuccessLogin={handleOpenDashboard}
              onNavigateHome={() => handleNavigatePublic('home')}
            />
          )}
        </main>

        {publicPage !== 'login' && <Footer onNavigate={handleNavigatePublic} />}

        {/* Global Floating AI Assistant Bot */}
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      </div>
    );
  }

  // Render ERP SaaS Dashboard
  return (
    <DashboardLayout
      currentTab={dashboardTab}
      onSelectTab={handleSelectDashboardTab}
      onNavigateHome={() => handleNavigatePublic('home')}
    >
      {dashboardTab === 'dashboard' && (
        role === 'student' ? (
          <StudentPortal onOpenAiChat={() => setIsAiModalOpen(true)} />
        ) : role === 'parent' ? (
          <ParentPortal />
        ) : (
          <AdminDashboard
            onNavigateTab={setDashboardTab}
            onOpenAiChat={() => setIsAiModalOpen(true)}
          />
        )
      )}

      {dashboardTab === 'classes' && <ClassesBatches />}
      {dashboardTab === 'students' && <StudentsList />}
      {dashboardTab === 'teachers' && <TeachersList />}
      {dashboardTab === 'attendance' && <AttendanceManager />}
      {dashboardTab === 'courses' && <CourseSubjects />}
      {dashboardTab === 'batches' && <ClassesBatches />}
      {dashboardTab === 'admissions' && <AdmissionsManager />}
      {dashboardTab === 'fees' && <FeeManagement />}
      {dashboardTab === 'examinations' && <Examinations />}
      {dashboardTab === 'timetable' && <Timetable />}
      {dashboardTab === 'homework' && <CourseSubjects />}
      {dashboardTab === 'library' && <CourseSubjects />}
      {dashboardTab === 'communication' && <CommunicationNotice />}
      {dashboardTab === 'reports' && <ReportsAnalytics />}
      {dashboardTab === 'settings' && <SystemSettings />}
      {dashboardTab === 'users' && <AuditSecurity />}
      {dashboardTab === 'integrations' && <SystemSettings />}
      {dashboardTab === 'audit' && <AuditSecurity />}

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SchoolProvider>
          <AppContent />
        </SchoolProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
