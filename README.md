# Digital AI School (ডিজিটাল এআই স্কুল)
## Production-Ready School Management SaaS Platform

> **Smart Education. Simple Management. Better Learning.**  
> Designed for Schools, Colleges & Madrasahs across Bangladesh.

---

### Features Summary

- **Executive ERP Dashboard**: Matches the reference UI with 5 key metric cards, batch overview bar chart, staff attendance donut (92% present), today's timetable timeline, AI admission predictions (72% conversion), AI fee defaulter risk alerts, and parent communication stats.
- **Bilingual Interface**: Seamless 1-click toggle between **English** and **বাংলা (Bangla)** with custom Bengali typography (*Hind Siliguri*).
- **Dark Mode & Light Mode**: Persistent theme toggle across all dashboard tabs and public pages.
- **Student Information System (SIS)**: Full student lifecycle with admission codes (`ADM-2026-XXXX`), roll numbers, photo badges, status management, CSV import/export, and profile modals.
- **Attendance Management**: Class/Section daily register with status toggles (`Present`, `Absent`, `Late`, `Excused`), 1-click *"Mark All Present"*, and CSV export.
- **Financial & Fee Management**: Invoicing and payment tracking in **Bangladeshi Taka (৳ BDT)** with mobile financial service integration (**bKash** & **Nagad**), fee defaulter risk analyzer, and official **Printable Payment Receipts**.
- **Examinations & Grading**: Aligned with the **Bangladesh National Curriculum GPA 5.0 scale** (A+, A, A-, B, C, D, F). Automated GPA calculation and **Printable Academic Transcripts / Report Cards**.
- **Admissions Workflow**: Online public application form, tracking reference generator (`APP-2026-XXXX`), public tracking portal, and 1-click admin **"Enroll as Student"** conversion into the active SIS roster.
- **Nova AI Education Assistant**: Bilingual AI tutor chatbot, 45-minute NCTB Lesson Plan Builder, and Exam Question Bank Generator (Google Gemini 1.5 Flash + built-in fallback education engine).
- **Public School Website**: Fully routed public school portal (Home, About, Principal's Message, Programs, Faculty, Admissions, Notices, Events Calendar, Online Result Lookup, and Contact).
- **Multi-Tenant SaaS & RBAC**: Tenant isolation model with `schools` and `school_memberships` in `supabase/schema.sql`, featuring an instant role switcher across 7 personas (Super Admin, School Admin, Teacher, Student, Parent, Accountant, Receptionist).

---

### Getting Started

#### 1. Setup Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

#### 4. Build for Production
```bash
npm run build
```

---

### Supabase Database Migration

The full schema migration script with Row Level Security (RLS) policies and performance indexes is located at:
- `supabase/schema.sql` (34 normalized PostgreSQL tables)
- `supabase/seed.sql` (realistic seed data for Bangladesh schools)
