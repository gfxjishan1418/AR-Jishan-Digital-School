import { 
  Student, Teacher, AcademicClass, Section, Subject, 
  Invoice, AdmissionApplication, Notice, AttendanceRecord, ExamResult, School
} from '../types';
import { 
  INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_CLASSES, 
  INITIAL_SECTIONS, INITIAL_SUBJECTS, INITIAL_INVOICES, 
  INITIAL_APPLICATIONS, INITIAL_NOTICES, INITIAL_SCHOOL,
  INITIAL_EXAM_RESULTS
} from '../data/initialMockData';
import { FirebaseService, isFirebaseConfigured } from './firebase';

const KEYS = {
  SCHOOL: 'dai_school',
  STUDENTS: 'dai_students',
  TEACHERS: 'dai_teachers',
  CLASSES: 'dai_classes',
  SECTIONS: 'dai_sections',
  SUBJECTS: 'dai_subjects',
  INVOICES: 'dai_invoices',
  APPLICATIONS: 'dai_applications',
  NOTICES: 'dai_notices',
  ATTENDANCE: 'dai_attendance',
  EXAM_RESULTS: 'dai_exam_results',
  THEME: 'dai_theme',
  LANG: 'dai_lang',
  CURRENT_USER: 'dai_current_user',
};

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  getSchool: (): School => {
    const s = getLocal(KEYS.SCHOOL, INITIAL_SCHOOL);
    if (!s || s.name.includes('Digital AI International') || s.name === 'Digital AI School') {
      s.name = 'AR Jishan Digital School & College';
      s.logo = '/logo.png';
      setLocal(KEYS.SCHOOL, s);
    }
    return s;
  },
  setSchool: (school: School) => setLocal(KEYS.SCHOOL, school),

  getStudents: (): Student[] => getLocal(KEYS.STUDENTS, INITIAL_STUDENTS),
  setStudents: (students: Student[]) => setLocal(KEYS.STUDENTS, students),
  addStudent: (student: Student) => {
    const list = StorageService.getStudents();
    const updated = [student, ...list];
    StorageService.setStudents(updated);
    if (isFirebaseConfigured) FirebaseService.syncStudent(student);
    return updated;
  },
  addStudents: (newStudents: Student[]) => {
    const list = StorageService.getStudents();
    const updated = [...newStudents, ...list];
    StorageService.setStudents(updated);
    if (isFirebaseConfigured) {
      newStudents.forEach(s => FirebaseService.syncStudent(s));
    }
    return updated;
  },
  updateStudent: (student: Student) => {
    const list = StorageService.getStudents();
    const updated = list.map(s => s.id === student.id ? student : s);
    StorageService.setStudents(updated);
    if (isFirebaseConfigured) FirebaseService.syncStudent(student);
    return updated;
  },
  deleteStudent: (id: string) => {
    const list = StorageService.getStudents();
    const updated = list.filter(s => s.id !== id);
    StorageService.setStudents(updated);
    return updated;
  },

  getTeachers: (): Teacher[] => getLocal(KEYS.TEACHERS, INITIAL_TEACHERS),
  setTeachers: (teachers: Teacher[]) => setLocal(KEYS.TEACHERS, teachers),
  addTeacher: (teacher: Teacher) => {
    const list = StorageService.getTeachers();
    const updated = [teacher, ...list];
    StorageService.setTeachers(updated);
    return updated;
  },
  addTeachers: (newTeachers: Teacher[]) => {
    const list = StorageService.getTeachers();
    const updated = [...newTeachers, ...list];
    StorageService.setTeachers(updated);
    return updated;
  },
  updateTeacher: (teacher: Teacher) => {
    const list = StorageService.getTeachers();
    const updated = list.map(t => t.id === teacher.id ? teacher : t);
    StorageService.setTeachers(updated);
    return updated;
  },

  getClasses: (): AcademicClass[] => getLocal(KEYS.CLASSES, INITIAL_CLASSES),
  addClass: (cls: AcademicClass) => {
    const list = StorageService.getClasses();
    const updated = [...list, cls];
    setLocal(KEYS.CLASSES, updated);
    return updated;
  },

  getSections: (): Section[] => getLocal(KEYS.SECTIONS, INITIAL_SECTIONS),
  addSection: (sec: Section) => {
    const list = StorageService.getSections();
    const updated = [...list, sec];
    setLocal(KEYS.SECTIONS, updated);
    return updated;
  },

  getSubjects: (): Subject[] => getLocal(KEYS.SUBJECTS, INITIAL_SUBJECTS),
  addSubject: (sub: Subject) => {
    const list = StorageService.getSubjects();
    const updated = [...list, sub];
    setLocal(KEYS.SUBJECTS, updated);
    return updated;
  },

  getInvoices: (): Invoice[] => getLocal(KEYS.INVOICES, INITIAL_INVOICES),
  setInvoices: (invoices: Invoice[]) => setLocal(KEYS.INVOICES, invoices),
  recordPayment: (invoiceId: string, amount: number, method: 'bKash' | 'Nagad' | 'Cash' | 'Bank Transfer', trxId?: string) => {
    const list = StorageService.getInvoices();
    const updated = list.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        const newBalance = Math.max(0, inv.amount - inv.discount - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balance: newBalance,
          status: newBalance === 0 ? ('Paid' as const) : ('Partial' as const),
          paymentMethod: method,
          transactionId: trxId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          paidDate: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    });
    StorageService.setInvoices(updated);
    if (isFirebaseConfigured) {
      const inv = updated.find(i => i.id === invoiceId);
      if (inv) FirebaseService.syncInvoice(inv);
    }
    return updated;
  },

  getApplications: (): AdmissionApplication[] => getLocal(KEYS.APPLICATIONS, INITIAL_APPLICATIONS),
  addApplication: (app: AdmissionApplication) => {
    const list = StorageService.getApplications();
    const updated = [app, ...list];
    setLocal(KEYS.APPLICATIONS, updated);
    if (isFirebaseConfigured) FirebaseService.syncApplication(app);
    return updated;
  },
  updateApplicationStatus: (id: string, status: AdmissionApplication['status']) => {
    const list = StorageService.getApplications();
    const updated = list.map(a => a.id === id ? { ...a, status } : a);
    setLocal(KEYS.APPLICATIONS, updated);
    if (isFirebaseConfigured) {
      const target = updated.find(a => a.id === id);
      if (target) FirebaseService.syncApplication(target);
    }
    return updated;
  },

  getNotices: (): Notice[] => getLocal(KEYS.NOTICES, INITIAL_NOTICES),
  addNotice: (notice: Notice) => {
    const list = StorageService.getNotices();
    const updated = [notice, ...list];
    setLocal(KEYS.NOTICES, updated);
    if (isFirebaseConfigured) FirebaseService.syncNotice(notice);
    return updated;
  },

  getExamResults: (): ExamResult[] => getLocal(KEYS.EXAM_RESULTS, INITIAL_EXAM_RESULTS),
  saveExamResult: (result: ExamResult) => {
    const list = StorageService.getExamResults();
    const index = list.findIndex(r => r.examId === result.examId && r.studentId === result.studentId && r.subjectId === result.subjectId);
    let updated;
    if (index >= 0) {
      updated = [...list];
      updated[index] = result;
    } else {
      updated = [result, ...list];
    }
    setLocal(KEYS.EXAM_RESULTS, updated);
    return updated;
  },

  getAttendanceForDate: (date: string, classId: string, sectionId: string): Record<string, AttendanceRecord['status']> => {
    const all = getLocal<Record<string, Record<string, AttendanceRecord['status']>>>(KEYS.ATTENDANCE, {});
    const key = `${date}_${classId}_${sectionId}`;
    return all[key] || {};
  },
  saveAttendanceForDate: (date: string, classId: string, sectionId: string, records: Record<string, AttendanceRecord['status']>) => {
    const all = getLocal<Record<string, Record<string, AttendanceRecord['status']>>>(KEYS.ATTENDANCE, {});
    const key = `${date}_${classId}_${sectionId}`;
    all[key] = records;
    setLocal(KEYS.ATTENDANCE, all);
    if (isFirebaseConfigured) {
      FirebaseService.syncAttendance(date, classId, sectionId, records);
    }
  }
};
