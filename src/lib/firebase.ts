import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// 1. Read Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// 2. Check if Firebase credentials are fully configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('your-api-key') &&
  firebaseConfig.apiKey.length > 10
);

// 3. Initialize Firebase safely
export const firebaseApp = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;

// Initialize Analytics safely
export let analytics: any = null;
if (typeof window !== 'undefined' && firebaseApp) {
  isAnalyticsSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(() => {});
}

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  projectId: string;
  authDomain: string;
}

export const getFirebaseStatus = (): FirebaseConnectionStatus => ({
  isConfigured: isFirebaseConfigured,
  projectId: firebaseConfig.projectId || 'Not configured',
  authDomain: firebaseConfig.authDomain || 'Not configured',
});

// 4. Firestore Service Helpers (Real-time Cloud Sync)
export const FirebaseService = {
  // Sync Student to Firestore
  syncStudent: async (student: any) => {
    if (!db) return false;
    try {
      const studentRef = doc(db, 'students', student.id);
      await setDoc(studentRef, {
        ...student,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase syncStudent error:', err);
      return false;
    }
  },

  // Sync Admission Application
  syncApplication: async (application: any) => {
    if (!db) return false;
    try {
      const appRef = doc(db, 'admission_applications', application.id);
      await setDoc(appRef, {
        ...application,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase syncApplication error:', err);
      return false;
    }
  },

  // Sync Attendance Record
  syncAttendance: async (date: string, classId: string, sectionId: string, records: any) => {
    if (!db) return false;
    try {
      const attendanceRef = doc(db, 'attendance', `${date}_${classId}_${sectionId}`);
      await setDoc(attendanceRef, {
        date,
        classId,
        sectionId,
        records,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error('Firebase syncAttendance error:', err);
      return false;
    }
  },

  // Sync Fee Invoice / Payment
  syncInvoice: async (invoice: any) => {
    if (!db) return false;
    try {
      const invoiceRef = doc(db, 'invoices', invoice.id);
      await setDoc(invoiceRef, {
        ...invoice,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase syncInvoice error:', err);
      return false;
    }
  },

  // Sync Notice
  syncNotice: async (notice: any) => {
    if (!db) return false;
    try {
      const noticeRef = doc(db, 'notices', notice.id);
      await setDoc(noticeRef, {
        ...notice,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase syncNotice error:', err);
      return false;
    }
  },

  // Authentication Helpers
  loginWithEmail: async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  signUpWithEmail: async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    return await createUserWithEmailAndPassword(auth, email, pass);
  },

  logout: async () => {
    if (auth) await firebaseSignOut(auth);
  }
};
