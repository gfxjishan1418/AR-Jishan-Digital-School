export type UserRole = 
  | 'super_admin' 
  | 'school_admin' 
  | 'teacher' 
  | 'student' 
  | 'parent' 
  | 'accountant' 
  | 'receptionist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId: string;
  phone?: string;
  studentId?: string; // If student
  childrenIds?: string[]; // If parent
  designation?: string; // If staff
}

export interface School {
  id: string;
  name: string;
  code: string;
  subdomain: string;
  address: string;
  city: string;
  eiinNumber: string;
  board: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  logo: string;
  totalStudents: number;
  totalTeachers: number;
  activeBatches: number;
  plan: 'starter' | 'pro_campus' | 'enterprise_ai';
}

export interface AcademicClass {
  id: string;
  name: string;
  code: string;
  numericOrder: number;
  totalStudents: number;
  sectionsCount: number;
}

export interface Section {
  id: string;
  classId: string;
  className: string;
  name: string;
  capacity: number;
  roomNumber: string;
  classTeacherName: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  classId: string;
  className: string;
  name: string;
  code: string;
  batchesCount: number;
  studentsCount: number;
  status: 'Active' | 'Archived';
  fullMarks: number;
  passMarks: number;
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: number;
  fullName: string;
  banglaName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  bloodGroup: string;
  religion: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  address: string;
  photoUrl: string;
  status: 'Active' | 'Suspended' | 'Transferred' | 'Graduated';
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  attendanceRate: number;
  enrolledDate: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  qualification: string;
  phone: string;
  email: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  status: 'Active' | 'On Leave' | 'Resigned';
  joiningDate: string;
  avatarUrl: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  classId: string;
  sectionId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface Exam {
  id: string;
  title: string;
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  classesIncluded: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  className: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  remarks: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  month: string;
  amount: number;
  discount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  paymentMethod?: 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  transactionId?: string;
  paidDate?: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  applyingClass: string;
  gender: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  previousSchool?: string;
  address: string;
  appliedDate: string;
  status: 'Pending' | 'Under Review' | 'Interview Scheduled' | 'Approved' | 'Rejected' | 'Enrolled';
  score?: number;
  remarks?: string;
}

export interface Assignment {
  id: string;
  title: string;
  className: string;
  sectionName: string;
  subjectName: string;
  teacherName: string;
  dueDate: string;
  totalPoints: number;
  description: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Holiday' | 'Exam' | 'Urgent' | 'General';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
  publishedDate: string;
  isPinned: boolean;
  attachmentUrl?: string;
  author: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  time: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
  className: string;
  sectionName: string;
}

export interface AIAdmissionPrediction {
  rate: number;
  confidenceScore: 'High' | 'Medium' | 'Low';
  predictedAdmissions: number;
  history: number[];
}

export interface AIFeeDefaulterAlert {
  id: string;
  studentName: string;
  rollNo: number;
  className: string;
  riskScore: number;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  dueAmount: number;
}

export interface AIInquiryFollowUp {
  id: string;
  action: string;
  targetPerson: string;
  context: string;
  timing: 'Today' | 'Tomorrow' | 'Upcoming';
  type: 'call' | 'brochure' | 'followup' | 'visit';
}
