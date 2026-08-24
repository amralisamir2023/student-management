import { ModuleConfig } from './module-config.model';
import { Course } from '../models/course.model';

const DEPTS = ['Computer Science', 'Information Systems', 'Engineering', 'Business Administration'];

export const COURSES_CONFIG: ModuleConfig<Course> = {
  key: 'courses',
  title: 'Courses',
  singular: 'course',
  addLabel: 'Add Course',
  searchPlaceholder: 'Search courses',
  layout: 'table',
  filters: [{ key: 'departmentId', label: 'All departments', options: DEPTS }],
  columns: [
    { label: 'Course name', render: (c) => c.name },
    { label: 'Code', render: (c) => c.code, badgeClass: () => 'badge badge-code' },
    { label: 'Hours', render: (c) => String(c.hours) },
    { label: 'Department', render: (c) => String(c.departmentId ?? '—'), badgeClass: () => 'badge badge-dept' },
    { label: 'Instructor', render: (c) => String(c.instructorId ?? '—') },
  ],
  fields: [
    { key: 'name', label: 'Course name', type: 'text', placeholder: 'Data Structures', required: true },
    { key: 'code', label: 'Course code', type: 'text', placeholder: 'CS201', required: true },
    { key: 'hours', label: 'Credit hours', type: 'number', placeholder: '3', required: true, parse: (v) => Number(v) },
    { key: 'departmentId', label: 'Department', type: 'select', required: true, options: DEPTS.map((d) => ({ label: d, value: d })) },
    {
      key: 'instructorId',
      label: 'Instructor',
      type: 'select',
      full: true,
      hint: 'Optional — can be assigned later',
      options: ['Dr. Hana Fouad', 'Dr. Omar Saleh', 'Eng. Laila Nabil', 'Dr. Ahmed Ghanem', 'Eng. Rana Sami'].map((n) => ({
        label: n,
        value: n,
      })),
    },
  ],
  initials: (c) => c.code.slice(0, 2).toUpperCase(),
  toFormModel: (c) => ({
    name: c.name,
    code: c.code,
    hours: String(c.hours),
    departmentId: String(c.departmentId ?? ''),
    instructorId: String(c.instructorId ?? ''),
  }),
  detailTitle: (c) => c.name,
  detailSubtitle: (c) => c.code,
  detailInfo: (c) => [
    { label: 'Code', value: c.code },
    { label: 'Hours', value: String(c.hours) },
    { label: 'Department', value: String(c.departmentId ?? '—') },
    { label: 'Instructor', value: String(c.instructorId ?? '—') },
  ],
};
