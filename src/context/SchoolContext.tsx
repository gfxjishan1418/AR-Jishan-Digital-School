import React, { createContext, useContext, useState, useEffect } from 'react';
import { School } from '../types';
import { StorageService } from '../lib/storage';

interface SchoolContextType {
  school: School;
  updateSchool: (updated: Partial<School>) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  allSchools: { id: string; name: string; city: string; plan: string }[];
  switchSchool: (schoolId: string) => void;
}

const DEMO_SCHOOLS = [
  { id: 'school_dhaka_01', name: 'Digital AI International Model School & College', city: 'Dhanmondi, Dhaka', plan: 'Enterprise AI' },
  { id: 'school_chittagong_02', name: 'Chittagong Smart Grammar Academy', city: 'Nasirabad, Chattogram', plan: 'Smart AI Pro' },
  { id: 'school_sylhet_03', name: 'Sylhet Digital English Medium School', city: 'Zindabazar, Sylhet', plan: 'Starter Campus' },
];

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchoolState] = useState<School>(() => StorageService.getSchool());
  const [academicYear, setAcademicYear] = useState<string>('2026');

  const updateSchool = (updates: Partial<School>) => {
    const updated = { ...school, ...updates };
    setSchoolState(updated);
    StorageService.setSchool(updated);
  };

  const switchSchool = (schoolId: string) => {
    const found = DEMO_SCHOOLS.find(s => s.id === schoolId);
    if (found) {
      updateSchool({
        id: found.id,
        name: found.name,
      });
    }
  };

  return (
    <SchoolContext.Provider value={{
      school,
      updateSchool,
      academicYear,
      setAcademicYear,
      allSchools: DEMO_SCHOOLS,
      switchSchool,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
