import { ModuleConfig } from './module-config.model';
import { Enrollment } from '../models/enrollment.model';

const TERMS = ['Fall 2026', 'Spring 2026', 'Fall 2025'];
const STATUSES: { label: string; value: Enrollment['status'] }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];
const STUDENTS = ['Mariam Adel', 'Youssef Kamal', 'Nour Hassan', 'Omar Tarek', 'Salma Ibrahim', 'Karim Fathy', 'Hana Mostafa'];
const COURSES = ['Data Structures', 'Database Systems', 'Linear Algebra', 'Web Development', 'Project Management', 'Operating Systems'];

function statusClass(status: Enrollment['status']): string {
  return `badge badge-${status}`;
}

export const ENROLLMENTS_CONFIG: ModuleConfig<Enrollment> = {
  key: 'enrollments',
  title: 'Enrollments',
  singular: 'enrollment',
  addLabel: 'New Enrollment',
  searchPlaceholder: 'Search enrollments',
  layout: 'table',
  filters: [
    { key: 'semester', label: 'All terms', options: TERMS },
    { key: 'status', label: 'All statuses', options: STATUSES.map((s) => s.value) },
  ],
  columns: [
    { label: 'Student', render: (e) => String(e.studentId), isPerson: true },
    { label: 'Course', render: (e) => String(e.courseId) },
    { label: 'Term', render: (e) => e.semester },
    { label: 'Grade', render: (e) => (e.grade != null ? String(e.grade) : '—'), mono: true },
    { label: 'Status', render: (e) => e.status[0].toUpperCase() + e.status.slice(1), badgeClass: (e) => statusClass(e.status) },
  ],
  fields: [
    { key: 'studentId', label: 'Student', type: 'select', required: true, options: STUDENTS.map((s) => ({ label: s, value: s })) },
    { key: 'courseId', label: 'Course', type: 'select', required: true, options: COURSES.map((c) => ({ label: c, value: c })) },
    { key: 'semester', label: 'Term', type: 'select', required: true, options: TERMS.map((t) => ({ label: t, value: t })) },
    { key: 'grade', label: 'Grade', type: 'number', placeholder: '0 - 100', min: 0, max: 100, hint: 'Optional until the course ends', parse: (v) => (v === '' ? undefined : Number(v)) },
    { key: 'status', label: 'Status', type: 'select', required: true, options: STATUSES },
  ],
  initials: (e) =>
    String(e.studentId)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
  toFormModel: (e) => ({
    studentId: String(e.studentId),
    courseId: String(e.courseId),
    semester: e.semester,
    grade: e.grade != null ? String(e.grade) : '',
    status: e.status,
  }),
  detailTitle: (e) => `${e.studentId} → ${e.courseId}`,
  detailSubtitle: (e) => e.semester,
  detailInfo: (e) => [
    { label: 'Term', value: e.semester },
    { label: 'Grade', value: e.grade != null ? String(e.grade) : '—' },
    { label: 'Status', value: e.status[0].toUpperCase() + e.status.slice(1) },
  ],
};
