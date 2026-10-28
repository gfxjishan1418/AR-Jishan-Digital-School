import { Student, Teacher } from '../types';

/**
 * Robust CSV parser that handles:
 * - Line breaks (\r\n or \n)
 * - Quoted fields with commas inside ("Hossain, Belal")
 * - Delimiters (comma or semicolon)
 */
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if ((char === ',' || char === ';') && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(col => col.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Last field/row if any
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(col => col.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Download text or CSV as a file in the browser
 */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Sample Student CSV Template
 */
export function generateStudentCSVTemplate(): string {
  const headers = [
    'Full Name',
    'Bangla Name',
    'Class',
    'Section',
    'Roll',
    'Gender',
    'Guardian Name',
    'Guardian Phone',
    'Blood Group',
    'Address',
    'Status'
  ];

  const sampleRows = [
    ['Tanvir Hossain', 'তানভীর হোসেন', 'Class 10', 'Section A (Padma)', '1', 'Male', 'Belal Hossain', '+8801711223344', 'A+', 'Dhanmondi, Dhaka', 'Active'],
    ['Sadia Afrin', 'সাদিয়া আফরিন', 'Class 10', 'Section B (Meghna)', '2', 'Female', 'Rezaul Karim', '+8801811334455', 'O+', 'Mirpur, Dhaka', 'Active'],
    ['Ahsan Habib', 'আহসান হাবিব', 'Class 9', 'Section A (Jamuna)', '3', 'Male', 'Habibur Rahman', '+8801911445566', 'B+', 'Uttara, Dhaka', 'Active']
  ];

  const csvRows = [
    headers.join(','),
    ...sampleRows.map(row => row.map(val => `"${val}"`).join(','))
  ];

  return csvRows.join('\r\n');
}

/**
 * Parse raw CSV into Student objects
 */
export function parseStudentsCSV(csvText: string, existingCount: number = 0): Student[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const dataRows = rows.slice(1);

  const students: Student[] = [];
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  ];

  dataRows.forEach((cols, index) => {
    const getValue = (...keys: string[]) => {
      for (const key of keys) {
        const idx = headers.findIndex(h => h.includes(key));
        if (idx !== -1 && cols[idx] !== undefined) {
          return cols[idx].trim();
        }
      }
      return '';
    };

    const fullName = getValue('name', 'fullname', 'studentname') || `Student ${existingCount + index + 1}`;
    const banglaName = getValue('bangla', 'banglaname');
    const className = getValue('class', 'classname') || 'Class 10';
    const sectionName = getValue('section', 'sectionname') || 'Section A (Padma)';
    const rollNo = Number(getValue('roll', 'rollno')) || (existingCount + index + 1);
    const gender = (getValue('gender').toLowerCase().startsWith('f') ? 'Female' : 'Male') as 'Male' | 'Female';
    const guardianName = getValue('guardian', 'guardianname', 'parent') || 'Guardian';
    const guardianPhone = getValue('phone', 'mobile', 'guardianphone') || '+880 1700-000000';
    const bloodGroup = getValue('blood', 'bloodgroup') || 'O+';
    const address = getValue('address', 'city') || 'Dhaka, Bangladesh';
    const status = (getValue('status') || 'Active') as any;

    const student: Student = {
      id: `stu-${Date.now()}-${index}`,
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo,
      fullName,
      banglaName: banglaName || undefined,
      gender,
      dateOfBirth: '2010-01-01',
      bloodGroup,
      religion: 'Islam',
      classId: 'c10',
      className,
      sectionId: 's10a',
      sectionName,
      guardianName,
      guardianPhone,
      guardianRelation: 'Parent',
      address,
      photoUrl: gender === 'Female' ? defaultAvatars[1] : defaultAvatars[0],
      status: status === 'Active' || status === 'Pending' ? status : 'Active',
      feeStatus: 'Paid',
      attendanceRate: 95,
      enrolledDate: new Date().toISOString().split('T')[0],
    };

    students.push(student);
  });

  return students;
}

/**
 * Sample Teacher CSV Template
 */
export function generateTeacherCSVTemplate(): string {
  const headers = [
    'Full Name',
    'Designation',
    'Department',
    'Qualification',
    'Phone',
    'Email',
    'Assigned Class',
    'Assigned Subject',
    'Status'
  ];

  const sampleRows = [
    ['Dr. Tariqul Islam', 'Senior Lecturer', 'Science & Mathematics', 'Ph.D. in Physics (DU)', '+8801711998877', 'tariqul@digitalaischool.edu.bd', 'Class 10', 'Physics', 'Active'],
    ['Nasreen Akter', 'Assistant Teacher', 'English Language', 'M.A. in English (JU)', '+8801811887766', 'nasreen@digitalaischool.edu.bd', 'Class 9', 'English First Paper', 'Active'],
    ['Mohammad Shafi', 'Senior Instructor', 'ICT & Computer Science', 'B.Sc. in CSE (BUET)', '+8801911776655', 'shafi@digitalaischool.edu.bd', 'Class 10', 'ICT', 'Active']
  ];

  const csvRows = [
    headers.join(','),
    ...sampleRows.map(row => row.map(val => `"${val}"`).join(','))
  ];

  return csvRows.join('\r\n');
}

/**
 * Parse raw CSV into Teacher objects
 */
export function parseTeachersCSV(csvText: string, existingCount: number = 0): Teacher[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const dataRows = rows.slice(1);

  const teachers: Teacher[] = [];
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
  ];

  dataRows.forEach((cols, index) => {
    const getValue = (...keys: string[]) => {
      for (const key of keys) {
        const idx = headers.findIndex(h => h.includes(key));
        if (idx !== -1 && cols[idx] !== undefined) {
          return cols[idx].trim();
        }
      }
      return '';
    };

    const fullName = getValue('name', 'fullname', 'teachername') || `Teacher ${existingCount + index + 1}`;
    const designation = getValue('designation', 'title', 'post') || 'Lecturer';
    const department = getValue('department', 'dept', 'faculty') || 'General';
    const qualification = getValue('qualification', 'degree') || 'M.A. / M.Sc.';
    const phone = getValue('phone', 'mobile', 'contact') || '+880 1711-000000';
    const email = getValue('email') || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@digitalaischool.edu.bd`;
    const assignedClass = getValue('class', 'assignedclass') || 'Class 10';
    const assignedSubject = getValue('subject', 'assignedsubject') || 'General Science';
    const status = (getValue('status') || 'Active') as any;

    const teacher: Teacher = {
      id: `tea-${Date.now()}-${index}`,
      employeeId: `TEA-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      designation,
      department,
      qualification,
      phone,
      email,
      assignedClasses: [assignedClass],
      assignedSubjects: [assignedSubject],
      status: status === 'Active' || status === 'On Leave' ? status : 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      avatarUrl: defaultAvatars[index % defaultAvatars.length],
    };

    teachers.push(teacher);
  });

  return teachers;
}
