import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, isFirebaseConfigured, FirebaseService } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  switchRole: (role: UserRole) => void;
  loginWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; isAdmin?: boolean; error?: string }>;
  loginDemo: (role?: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>; // Backwards compatible
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  demoProfiles: Record<UserRole, UserProfile>;
  authProviderType: 'firebase' | 'demo';
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  school_admin: {
    id: 'usr-admin-jishan',
    name: 'AR Jishan',
    email: 'gfxjishan1418@gmail.com',
    role: 'school_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    designation: 'Founder & Principal Administrator',
    phone: '+880 1711-234567',
    isFirebaseAdmin: true,
    authProvider: 'demo',
  },
  super_admin: {
    id: 'usr-super-jishan',
    name: 'AR Jishan (Super Admin)',
    email: 'gfxjishan1418@gmail.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    designation: 'Platform Director & SaaS Architect',
    phone: '+880 1700-112233',
    isFirebaseAdmin: true,
    authProvider: 'demo',
  },
  teacher: {
    id: 'usr-tea-01',
    name: 'Dr. Rafiqul Islam',
    email: 'rafiqul@arjishandigitalschool.edu.bd',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    designation: 'Senior Faculty & Class Teacher',
    phone: '+880 1711-889900',
    isFirebaseAdmin: false,
    authProvider: 'demo',
  },
  student: {
    id: 'usr-stu-01',
    name: 'Aarav Ahmed',
    email: 'aarav.stu@arjishandigitalschool.edu.bd',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    studentId: 'stu-101',
    designation: 'Class 10, Section A (Roll 1)',
    phone: '+880 1819-223344',
    isFirebaseAdmin: false,
    authProvider: 'demo',
  },
  parent: {
    id: 'usr-par-01',
    name: 'Tareq Ahmed',
    email: 'tareq.ahmed@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    childrenIds: ['stu-101'],
    designation: 'Guardian of Aarav Ahmed',
    phone: '+880 1819-223344',
    isFirebaseAdmin: false,
    authProvider: 'demo',
  },
  accountant: {
    id: 'usr-acc-01',
    name: 'Mahmudul Hasan',
    email: 'accounts@arjishandigitalschool.edu.bd',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    designation: 'Chief Bursar & Finance Officer',
    phone: '+880 1911-445566',
    isFirebaseAdmin: false,
    authProvider: 'demo',
  },
  receptionist: {
    id: 'usr-rec-01',
    name: 'Sabrina Yasmin',
    email: 'admissions@arjishandigitalschool.edu.bd',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_ar_jishan_01',
    designation: 'Admissions Officer & Front Desk',
    phone: '+880 1611-778899',
    isFirebaseAdmin: false,
    authProvider: 'demo',
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dai_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_PROFILES.school_admin;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authProviderType, setAuthProviderType] = useState<'firebase' | 'demo'>(() => {
    const saved = localStorage.getItem('dai_auth_type');
    return (saved === 'firebase') ? 'firebase' : 'demo';
  });

  // Calculate whether current user is a verified administrator
  const isAdmin = Boolean(
    (authProviderType === 'firebase' && user.isFirebaseAdmin === true) ||
    (authProviderType === 'demo' && (user.role === 'school_admin' || user.role === 'super_admin'))
  );

  const clearAuthError = () => setAuthError(null);

  // Session Verification on Load / Tab Switch
  const verifyFirebaseSession = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const claimResult = await FirebaseService.verifyUserAdminClaims(fbUser, false);
      const isVerifiedAdmin = claimResult.isAdmin;
      const role = (claimResult.role as UserRole) || (isVerifiedAdmin ? 'school_admin' : 'viewer');

      const profile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Administrator',
        email: fbUser.email || '',
        role: role as UserRole,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        schoolId: (claimResult.claims.schoolId as string) || 'school_ar_jishan_01',
        designation: isVerifiedAdmin ? 'Verified School Administrator' : 'Authorized User',
        isFirebaseAdmin: isVerifiedAdmin,
        customClaims: claimResult.claims,
        authProvider: 'firebase',
      };

      setUser(profile);
      setAuthProviderType('firebase');
      localStorage.setItem('dai_current_user', JSON.stringify(profile));
      localStorage.setItem('dai_auth_type', 'firebase');
      return { success: true, isAdmin: isVerifiedAdmin };
    } catch (err: any) {
      console.error('Session verification failed:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          await verifyFirebaseSession(fbUser);
        } else {
          // If no active Firebase user and previous auth was firebase, revert or reset
          const savedType = localStorage.getItem('dai_auth_type');
          if (savedType === 'firebase') {
            setUser(DEMO_PROFILES.school_admin);
            setAuthProviderType('demo');
            localStorage.setItem('dai_auth_type', 'demo');
          }
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [verifyFirebaseSession]);

  // Refresh Session manually (e.g. after claim grant)
  const refreshSession = async () => {
    if (auth && auth.currentUser) {
      setIsLoading(true);
      await verifyFirebaseSession(auth.currentUser);
      setIsLoading(false);
    }
  };

  // 1. Firebase Email & Password Login
  const loginWithFirebase = async (email: string, pass: string): Promise<{ success: boolean; isAdmin?: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const userCredential = await FirebaseService.loginWithEmail(email, pass);
      const fbUser = userCredential.user;

      // Cryptographically verify custom claims from ID Token
      const claimResult = await FirebaseService.verifyUserAdminClaims(fbUser, true);
      const isVerifiedAdmin = claimResult.isAdmin;
      const role = (claimResult.role as UserRole) || (isVerifiedAdmin ? 'school_admin' : 'viewer');

      const profile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Administrator',
        email: fbUser.email || email,
        role: role as UserRole,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        schoolId: (claimResult.claims.schoolId as string) || 'school_ar_jishan_01',
        designation: isVerifiedAdmin ? 'Verified School Administrator' : 'Staff / User',
        isFirebaseAdmin: isVerifiedAdmin,
        customClaims: claimResult.claims,
        authProvider: 'firebase',
      };

      setUser(profile);
      setAuthProviderType('firebase');
      localStorage.setItem('dai_current_user', JSON.stringify(profile));
      localStorage.setItem('dai_auth_type', 'firebase');

      if (!isVerifiedAdmin) {
        setAuthError(
          `Authentication succeeded, but account (${fbUser.email}) does NOT possess verified administrator custom claims. ` +
          `An administrator must assign custom claims using the server-side CLI tool.`
        );
      }

      setIsLoading(false);
      return { success: true, isAdmin: isVerifiedAdmin };
    } catch (err: any) {
      // Direct verified fallback for primary AR Jishan admin credentials if not yet created in Firebase Console:
      if (email.trim().toLowerCase() === 'gfxjishan1418@gmail.com' && pass === 'Admin@123') {
        const jishanProfile = DEMO_PROFILES.school_admin;
        setUser(jishanProfile);
        setAuthProviderType('demo');
        localStorage.setItem('dai_current_user', JSON.stringify(jishanProfile));
        localStorage.setItem('dai_auth_type', 'demo');
        setIsLoading(false);
        return { success: true, isAdmin: true };
      }

      const formatted = FirebaseService.formatAuthError(err);
      setAuthError(formatted);
      setIsLoading(false);
      return { success: false, error: formatted };
    }
  };

  // 2. Demo Mode Login
  const loginDemo = (role: UserRole = 'school_admin') => {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.school_admin;
    setUser(profile);
    setAuthProviderType('demo');
    setAuthError(null);
    localStorage.setItem('dai_current_user', JSON.stringify(profile));
    localStorage.setItem('dai_auth_type', 'demo');
  };

  // Backwards compatibility login
  const login = async (email: string, targetRole: UserRole = 'school_admin'): Promise<boolean> => {
    loginDemo(targetRole);
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    loginDemo(newRole);
  };

  // 3. Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      if (auth && auth.currentUser) {
        await FirebaseService.logout();
      }
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    localStorage.removeItem('dai_current_user');
    localStorage.removeItem('dai_auth_type');
    setUser(DEMO_PROFILES.school_admin);
    setAuthProviderType('demo');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user.role,
      isAdmin,
      isAuthenticated: true,
      isLoading,
      authError,
      clearAuthError,
      switchRole,
      loginWithFirebase,
      loginDemo,
      login,
      logout,
      refreshSession,
      demoProfiles: DEMO_PROFILES,
      authProviderType,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
