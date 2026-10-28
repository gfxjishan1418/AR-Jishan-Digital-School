-- ============================================================================
-- DIGITAL AI SCHOOL — SEED DATA (BANGLADESH CONTEXT)
-- ============================================================================

-- 1. Insert Subscription Plans
INSERT INTO subscription_plans (id, name, code, price_bdt, billing_period, max_students, max_teachers, has_ai_assistant, has_sms_gateway, features)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Starter Campus', 'starter', 4999.00, 'monthly', 300, 25, false, false, '["Student Info System", "Attendance Tracker", "Basic Gradebook", "Fee Invoicing"]'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Smart AI Pro', 'pro_campus', 9999.00, 'monthly', 1000, 75, true, true, '["AI Lesson Planner", "AI Quiz Generator", "Online Admissions", "SMS Notifications", "bKash/Nagad Billing", "Bangla & English Portal"]'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Digital AI Enterprise', 'enterprise_ai', 19999.00, 'monthly', 5000, 250, true, true, '["Custom Domain", "Dedicated AI Tutor Bot", "Unlimited Storage", "Priority 24/7 SLA", "Custom Board Result Sync"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Demo School
INSERT INTO schools (
    id, name, code, subdomain, address, city, division, country, phone, email, website, logo_url, currency, currency_symbol, eiin_number, board, status, subscription_plan_id
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Digital AI International Model School & College',
    'DAI-DHK-2026',
    'dhaka-model',
    'House 42, Road 9/A, Dhanmondi R/A',
    'Dhaka',
    'Dhaka',
    'Bangladesh',
    '+880 1711-000000',
    'info@digitalaischool.edu.bd',
    'https://digitalaischool.edu.bd',
    '/logo.png',
    'BDT',
    '৳',
    '134892',
    'Dhaka Education Board',
    'active',
    '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (code) DO NOTHING;

-- 3. Academic Year & Term
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
VALUES 
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Academic Session 2026', '2026-01-01', '2026-12-31', true);

INSERT INTO terms (id, school_id, academic_year_id, name, start_date, end_date, is_current)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Mid-Term Assessment 2026', '2026-04-15', '2026-05-10', true);

-- 4. Classes
INSERT INTO classes (id, school_id, name, code, numeric_order, description) VALUES
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Class 6', 'C06', 6, 'Junior Secondary Level'),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Class 7', 'C07', 7, 'Junior Secondary Level'),
('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Class 8', 'C08', 8, 'Junior Secondary Level'),
('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Class 9', 'C09', 9, 'Secondary (Science/Business/Humanities)'),
('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Class 10', 'C10', 10, 'SSC Candidate Batch');

-- 5. Sections
INSERT INTO sections (id, school_id, class_id, name, capacity, room_number) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Section A (Padma)', 40, 'Room 201'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Section B (Meghna)', 40, 'Room 202'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000009', 'Section A (Jamuna)', 40, 'Room 105');

-- 6. Subjects
INSERT INTO subjects (id, school_id, class_id, name, code, subject_type, full_marks, pass_marks) VALUES
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Bangla (1st & 2nd Paper)', 'BAN101', 'core', 100, 33),
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'English (For Today & Grammar)', 'ENG102', 'core', 100, 33),
('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'General Mathematics', 'MATH103', 'core', 100, 33),
('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Physics', 'PHY104', 'core', 100, 33),
('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Chemistry', 'CHEM105', 'core', 100, 33),
('f0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'Information & Communication Tech (ICT)', 'ICT106', 'core', 100, 33);
