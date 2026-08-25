import { ModuleConfig } from '../../core/config/module-config.model';
import { Enrollment } from './enrollment.model';
import { Student } from '../students/student.model';
import { Course } from '../courses/course.model';
import { StudentService } from '../students/student.service';
import { CourseService } from '../courses/course.service';
import { loadOptions } from '../../core/config/options-loader.util';

const TERMS = ['Fall 2026', 'Spring 2026', 'Fall 2025'];
const STATUSES: { label: string; value: Enrollment['status'] }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];





function studentLabel(e: Enrollment): string {
  const s = e.studentId as Student;
  return s && typeof s === 'object' ? s.name : e.studentId ? String(e.studentId) : 'Deleted student';
}

function studentIdValue(e: Enrollment): string {
  const s = e.studentId as Student;
  return s && typeof s === 'object' ? s._id : String(e.studentId ?? '');
}

function courseLabel(e: Enrollment): string {
  const c = e.courseId as Course;
  return c && typeof c === 'object' ? `${c.name} (${c.code})` : e.courseId ? String(e.courseId) : 'Deleted course';
}

function courseIdValue(e: Enrollment): string {
  const c = e.courseId as Course;
  return c && typeof c === 'object' ? c._id : String(e.courseId ?? '');
}

function statusClass(status: Enrollment['status']): string {
  return `badge badge-${status}`;
}

export function buildEnrollmentsConfig(studentService: StudentService, courseService: CourseService): ModuleConfig<Enrollment> {
  const studentOptions = loadOptions(
    () => studentService.list(),
    (s) => `${s.name} (${s.email})`
  );
  const courseOptions = loadOptions(
    () => courseService.list(),
    (c) => `${c.name} (${c.code})`
  );

  return {
    key: 'enrollments',
    title: 'Enrollments',
    singular: 'enrollment',
    addLabel: 'New Enrollment',
    searchPlaceholder: 'Search enrollments',
    layout: 'table',
    
    
    
    
    filters: [{ key: 'semester', label: 'All terms', options: TERMS }],
    columns: [
      { label: 'Student', render: studentLabel, isPerson: true },
      { label: 'Course', render: courseLabel },
      { label: 'Term', render: (e) => e.semester },
      { label: 'Grade', render: (e) => (e.grade != null ? String(e.grade) : '—'), mono: true },
      { label: 'Status', render: (e) => e.status[0].toUpperCase() + e.status.slice(1), badgeClass: (e) => statusClass(e.status) },
    ],
    fields: [
      { key: 'studentId', label: 'Student', type: 'select', required: true },
      { key: 'courseId', label: 'Course', type: 'select', required: true },
      { key: 'semester', label: 'Term', type: 'select', required: true, options: TERMS.map((t) => ({ label: t, value: t })) },
      {
        key: 'grade',
        label: 'Grade',
        type: 'number',
        placeholder: '0 - 100',
        min: 0,
        max: 100,
        hint: 'Optional until the course ends',
        parse: (v) => (v === '' ? undefined : Number(v)),
      },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUSES },
    ],
    initials: (e) =>
      studentLabel(e)
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
    toFormModel: (e) => ({
      studentId: studentIdValue(e),
      courseId: courseIdValue(e),
      semester: e.semester,
      grade: e.grade != null ? String(e.grade) : '',
      status: e.status,
    }),
    optionsLoaders: {
      studentId: studentOptions,
      courseId: courseOptions,
    },
    detailTitle: (e) => `${studentLabel(e)} → ${courseLabel(e)}`,
    detailSubtitle: (e) => e.semester,
    detailInfo: (e) => [
      { label: 'Term', value: e.semester },
      { label: 'Grade', value: e.grade != null ? String(e.grade) : '—' },
      { label: 'Status', value: e.status[0].toUpperCase() + e.status.slice(1) },
    ],
  };
}
