import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  demoProfiles: Record<UserRole, UserProfile>;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  school_admin: {
    id: 'usr-admin-01',
    name: 'Ms. Ria',
    email: 'ria.admin@digitalaischool.edu.bd',
    role: 'school_admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    designation: 'Administrator & Principal',
    phone: '+880 1711-234567'
  },
  super_admin: {
    id: 'usr-super-01',
    name: 'Tanvir Hossain',
    email: 'superadmin@digitalaischool.edu.bd',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    designation: 'Platform Director & SaaS Architect',
    phone: '+880 1700-112233'
  },
  teacher: {
    id: 'usr-tea-01',
    name: 'Dr. Rafiqul Islam',
    email: 'rafiqul@digitalaischool.edu.bd',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    designation: 'Senior Faculty & Class Teacher',
    phone: '+880 1711-889900'
  },
  student: {
    id: 'usr-stu-01',
    name: 'Aarav Ahmed',
    email: 'aarav.stu@digitalaischool.edu.bd',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    studentId: 'stu-101',
    designation: 'Class 10, Section A (Roll 1)',
    phone: '+880 1819-223344'
  },
  parent: {
    id: 'usr-par-01',
    name: 'Tareq Ahmed',
    email: 'tareq.ahmed@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    childrenIds: ['stu-101'],
    designation: 'Guardian of Aarav Ahmed',
    phone: '+880 1819-223344'
  },
  accountant: {
    id: 'usr-acc-01',
    name: 'Mahmudul Hasan',
    email: 'accounts@digitalaischool.edu.bd',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    designation: 'Chief Bursar & Finance Officer',
    phone: '+880 1911-445566'
  },
  receptionist: {
    id: 'usr-rec-01',
    name: 'Sabrina Yasmin',
    email: 'admissions@digitalaischool.edu.bd',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    schoolId: 'school_dhaka_01',
    designation: 'Admissions Officer & Front Desk',
    phone: '+880 1611-778899'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dai_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to Ms. Ria Administrator
    return DEMO_PROFILES.school_admin;
  });

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole] || DEMO_PROFILES.school_admin;
    setUser(profile);
    localStorage.setItem('dai_current_user', JSON.stringify(profile));
  };

  const login = async (email: string, targetRole: UserRole = 'school_admin'): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!',
        });
        if (!error) {
          switchRole(targetRole);
          return true;
        }
      } catch (e) {
        console.warn('Supabase login fallback:', e);
      }
    }
    // Demo fallback login
    switchRole(targetRole);
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    switchRole('school_admin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user.role,
      switchRole,
      login,
      logout,
      isAuthenticated: true,
      demoProfiles: DEMO_PROFILES
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
