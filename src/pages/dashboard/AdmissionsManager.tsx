import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../lib/storage';
import { AdmissionApplication, Student } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { UserPlus, Search, CheckCircle, Clock, XCircle, Eye, ArrowRight } from 'lucide-react';

export const AdmissionsManager: React.FC = () => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => StorageService.getApplications());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeApp, setActiveApp] = useState<AdmissionApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filtered = applications.filter(app => {
    const matchSearch = 
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(search.toLowerCase()) ||
      app.guardianPhone.includes(search);
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id: string, newStatus: AdmissionApplication['status']) => {
    const updated = StorageService.updateApplicationStatus(id, newStatus);
    setApplications(updated);
  };

  const handleEnrollStudent = (app: AdmissionApplication) => {
    // 1. Update application status to Enrolled
    const updatedApps = StorageService.updateApplicationStatus(app.id, 'Enrolled');
    setApplications(updatedApps);

    // 2. Add to active Student Roster
    const currentStudents = StorageService.getStudents();
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo: currentStudents.length + 1,
      fullName: app.applicantName,
      gender: app.gender as any || 'Male',
      dateOfBirth: app.dateOfBirth,
      bloodGroup: 'B+',
      religion: 'Islam',
      classId: 'c10',
      className: app.applyingClass,
      sectionId: 's10a',
      sectionName: 'Section A (Padma)',
      guardianName: app.guardianName,
      guardianPhone: app.guardianPhone,
      guardianRelation: 'Guardian',
      address: app.address || 'Dhaka',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      status: 'Active',
      feeStatus: 'Pending',
      attendanceRate: 100,
      enrolledDate: new Date().toISOString().split('T')[0],
    };

    StorageService.addStudent(newStudent);
    alert(`Success! ${app.applicantName} has been formally enrolled with Admission ID ${newStudent.admissionNo}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.modules.admissions} — Application Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review online applications, schedule interviews, verify transcripts & 1-click enroll to SIS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue">Session 2026 Admissions Open</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by applicant name, phone, or application code..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="all">All Pipeline Stages</option>
              <option value="Pending">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Approved">Approved</option>
              <option value="Enrolled">Enrolled in SIS</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Application No</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {app.applicationNo}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{app.applicantName}</p>
                    <p className="text-[10px] text-slate-500">{app.gender} • DOB: {app.dateOfBirth}</p>
                  </td>

                  <td className="py-3 px-4 font-semibold text-brand-700 dark:text-brand-300">
                    {app.applyingClass}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900 dark:text-white">{app.guardianName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{app.guardianPhone}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {app.appliedDate}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Approved">Approved</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'Approved' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEnrollStudent(app)}
                          icon={<UserPlus className="w-3.5 h-3.5" />}
                        >
                          Enroll to SIS
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setActiveApp(app);
                          setIsViewModalOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Application Modal */}
      {activeApp && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Admission Application — ${activeApp.applicationNo}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <p><span className="text-slate-500">Applicant:</span> <strong>{activeApp.applicantName}</strong></p>
              <p><span className="text-slate-500">Applying For:</span> <strong>{activeApp.applyingClass}</strong></p>
              <p><span className="text-slate-500">Previous School:</span> <span>{activeApp.previousSchool || 'Not provided'}</span></p>
              <p><span className="text-slate-500">Guardian:</span> <strong>{activeApp.guardianName}</strong> ({activeApp.guardianPhone})</p>
              <p><span className="text-slate-500">Address:</span> <span>{activeApp.address}</span></p>
              <p><span className="text-slate-500">Applied Date:</span> <span>{activeApp.appliedDate}</span></p>
              <p><span className="text-slate-500">Current Status:</span> <Badge variant="blue">{activeApp.status}</Badge></p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
