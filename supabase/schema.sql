-- ============================================================================
-- DIGITAL AI SCHOOL — SAAS MULTI-TENANT DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Subscription Plans (Platform Level)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE, -- 'starter', 'pro_campus', 'enterprise_ai'
    price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    billing_period VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
    max_students INT NOT NULL DEFAULT 200,
    max_teachers INT NOT NULL DEFAULT 20,
    has_ai_assistant BOOLEAN NOT NULL DEFAULT true,
    has_sms_gateway BOOLEAN NOT NULL DEFAULT false,
    has_custom_domain BOOLEAN NOT NULL DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Schools / Tenants
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'DAI-DHK-01'
    subdomain VARCHAR(100) UNIQUE,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Dhaka',
    division VARCHAR(100) DEFAULT 'Dhaka',
    country VARCHAR(100) DEFAULT 'Bangladesh',
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,
    currency VARCHAR(10) DEFAULT 'BDT',
    currency_symbol VARCHAR(10) DEFAULT '৳',
    eiin_number VARCHAR(50), -- Educational Institute Identification Number (Bangladesh)
    board VARCHAR(100) DEFAULT 'Dhaka Education Board',
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'trial'
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    settings JSONB DEFAULT '{
        "enable_ai_tutor": true,
        "enable_sms_alerts": true,
        "default_language": "en",
        "grading_system": "gpa_5"
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- References auth.users(id)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    avatar_url TEXT,
    user_type VARCHAR(50) NOT NULL DEFAULT 'student', 
    -- 'super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'receptionist'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. School Memberships (Tenancy Binding + RBAC)
CREATE TABLE IF NOT EXISTS school_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, 
    -- 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'receptionist'
    permissions JSONB DEFAULT '[]'::jsonb,
    is_primary BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, user_id, role)
);

-- 5. Academic Years & Terms
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. '2025-2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'First Term', 'Half-Yearly', 'Annual Exam'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Classes and Sections
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. 'Class 10', 'Class 9', 'Nursery'
    code VARCHAR(20) NOT NULL,  -- e.g. 'C10'
    numeric_order INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- 'Section A', 'Section B', 'Padma', 'Meghna'
    capacity INT DEFAULT 40,
    room_number VARCHAR(50),
    class_teacher_id UUID, -- References staff(id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, name)
);

-- 7. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL, -- 'General Science', 'Higher Mathematics', 'Bangla 1st Paper'
    code VARCHAR(50) NOT NULL,  -- 'MATH101', 'PHY102'
    subject_type VARCHAR(50) DEFAULT 'core', -- 'core', 'elective', 'lab'
    full_marks INT DEFAULT 100,
    pass_marks INT DEFAULT 33,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Staff / Teachers
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    employee_id VARCHAR(50) NOT NULL, -- e.g. 'TEA-1029'
    designation VARCHAR(100) NOT NULL, -- 'Senior Teacher', 'Head of Department'
    department VARCHAR(100), -- 'Science', 'Mathematics', 'Humanities'
    qualification VARCHAR(255),
    joining_date DATE,
    salary_bdt NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'on_leave', 'resigned'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, employee_id)
);

-- 9. Teacher Assignments (Subject & Class allocation)
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Guardians
CREATE TABLE IF NOT EXISTS guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    primary_phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50),
    email VARCHAR(150),
    occupation VARCHAR(100),
    nid_number VARCHAR(50),
    present_address TEXT,
    permanent_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    admission_number VARCHAR(50) NOT NULL, -- e.g. 'ADM-2026-0042'
    roll_number INT,
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID NOT NULL REFERENCES sections(id),
    academic_year_id UUID REFERENCES academic_years(id),
    guardian_id UUID REFERENCES guardians(id),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20), -- 'Male', 'Female', 'Other'
    blood_group VARCHAR(10), -- 'A+', 'B+', 'O+', 'AB+'
    religion VARCHAR(50) DEFAULT 'Islam',
    photo_url TEXT,
    emergency_contact VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'transferred', 'graduated', 'suspended'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, admission_number)
);

-- 12. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'late', 'excused'
    remarks TEXT,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 13. Examinations & Results
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    term_id UUID REFERENCES terms(id),
    title VARCHAR(255) NOT NULL, -- 'Annual Examination 2026'
    exam_type VARCHAR(50) DEFAULT 'term', -- 'term', 'quiz', 'mock', 'board_model'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100,
    grade VARCHAR(10), -- 'A+', 'A', 'A-', 'B', 'C', 'D', 'F'
    grade_point NUMERIC(3, 2), -- 5.00, 4.00, etc.
    remarks TEXT,
    entered_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(exam_id, student_id, subject_id)
);

-- 14. Fee Categories, Invoices & Payments
CREATE TABLE IF NOT EXISTS fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- 'Monthly Tuition', 'Admission Fee', 'Lab Fee', 'Exam Fee'
    description TEXT,
    is_recurring BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL, -- e.g. 'INV-2026-0089'
    month VARCHAR(20), -- 'May 2026'
    due_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    paid_amount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'partially_paid', 'paid', 'overdue'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    fee_category_id UUID REFERENCES fee_categories(id),
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL, -- e.g. 'REC-2026-4029'
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bkash', 'nagad', 'bank_transfer', 'card'
    transaction_id VARCHAR(100),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_by UUID REFERENCES profiles(id),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Admission Applications (Public & Admin workflow)
CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    application_number VARCHAR(50) NOT NULL UNIQUE, -- 'APP-2026-9281'
    applicant_name VARCHAR(255) NOT NULL,
    applying_for_class_id UUID NOT NULL REFERENCES classes(id),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(50) NOT NULL,
    guardian_email VARCHAR(150),
    previous_school VARCHAR(255),
    address TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_review', 'interview_scheduled', 'approved', 'rejected', 'enrolled'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Assignments and Submissions
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES staff(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    max_points INT DEFAULT 100,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    grade NUMERIC(5, 2),
    feedback TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'graded', 'late'
    UNIQUE(assignment_id, student_id)
);

-- 17. Notices and Events
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general', -- 'academic', 'holiday', 'exam', 'urgent', 'general'
    target_audience VARCHAR(50) DEFAULT 'all', -- 'all', 'students', 'teachers', 'parents'
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    event_type VARCHAR(50) DEFAULT 'cultural', -- 'sports', 'cultural', 'academic', 'meeting'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'student_enrolled', 'marks_updated', 'payment_recorded'
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch requesting user's school memberships
CREATE OR REPLACE FUNCTION get_user_school_ids()
RETURNS SETOF UUID AS $$
    SELECT school_id FROM school_memberships WHERE user_id = auth.uid() AND status = 'active';
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policy: Users can view their assigned schools
CREATE POLICY "school_member_isolation" ON schools
    FOR SELECT USING (
        id IN (SELECT get_user_school_ids())
        OR status = 'active' -- Allow public listing of active schools for portal
    );

-- RLS Policy: Students isolation
CREATE POLICY "students_school_isolation" ON students
    FOR ALL USING (school_id IN (SELECT get_user_school_ids()));

-- RLS Policy: Attendance isolation
CREATE POLICY "attendance_school_isolation" ON attendance_records
    FOR ALL USING (school_id IN (SELECT get_user_school_ids()));

-- RLS Policy: Exam Results isolation
CREATE POLICY "exam_results_school_isolation" ON exam_results
    FOR ALL USING (school_id IN (SELECT get_user_school_ids()));

-- RLS Policy: Invoices isolation
CREATE POLICY "invoices_school_isolation" ON invoices
    FOR ALL USING (school_id IN (SELECT get_user_school_ids()));

-- RLS Policy: Notices (school members can view their school's notices)
CREATE POLICY "notices_school_isolation" ON notices
    FOR SELECT USING (school_id IN (SELECT get_user_school_ids()) OR is_published = true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date, class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status, due_date);
CREATE INDEX IF NOT EXISTS idx_exam_results ON exam_results(exam_id, student_id);
CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(school_id, is_published, target_audience);
