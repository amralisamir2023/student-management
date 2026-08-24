import { ModuleConfig } from './module-config.model';
import { Course } from '../models/course.model';
import { Department } from '../models/department.model';
import { Instructor } from '../models/instructor.model';
import { DepartmentService } from '../services/department.service';
import { InstructorService } from '../services/instructor.service';
import { loadOptions } from './options-loader.util';

function departmentName(c: Course): string {
  const d = c.departmentId as Department;
  return d && typeof d === 'object' ? d.name : c.departmentId ? String(c.departmentId) : '—';
}

function departmentIdValue(c: Course): string {
  const d = c.departmentId as Department;
  return d && typeof d === 'object' ? d._id : String(c.departmentId ?? '');
}

function instructorName(c: Course): string {
  const i = c.instructorId as Instructor;
  return i && typeof i === 'object' ? i.name : c.instructorId ? String(c.instructorId) : '—';
}

function instructorIdValue(c: Course): string {
  const i = c.instructorId as Instructor;
  return i && typeof i === 'object' ? i._id : String(c.instructorId ?? '');
}

export function buildCoursesConfig(departmentService: DepartmentService, instructorService: InstructorService): ModuleConfig<Course> {
  const departmentOptions = loadOptions(
    () => departmentService.list(),
    (d) => `${d.name} (${d.code})`
  );
  const instructorOptions = loadOptions(
    () => instructorService.list(),
    (i) => i.name
  );

  return {
    key: 'courses',
    title: 'Courses',
    singular: 'course',
    addLabel: 'Add Course',
    searchPlaceholder: 'Search courses',
    layout: 'table',
    filters: [{ key: 'departmentId', label: 'All departments', options: [], optionsLoader: departmentOptions }],
    columns: [
      { label: 'Course name', render: (c) => c.name },
      { label: 'Code', render: (c) => c.code, badgeClass: () => 'badge badge-code' },
      { label: 'Hours', render: (c) => String(c.hours) },
      { label: 'Department', render: departmentName, badgeClass: () => 'badge badge-dept' },
      { label: 'Instructor', render: instructorName },
    ],
    fields: [
      { key: 'name', label: 'Course name', type: 'text', placeholder: 'Data Structures', required: true },
      { key: 'code', label: 'Course code', type: 'text', placeholder: 'CS201', required: true },
      { key: 'hours', label: 'Credit hours', type: 'number', placeholder: '3', required: true, min: 1, parse: (v) => Number(v) },
      { key: 'departmentId', label: 'Department', type: 'select', required: true },
      { key: 'instructorId', label: 'Instructor', type: 'select', full: true, hint: 'Optional — can be assigned later' },
    ],
    initials: (c) => c.code.slice(0, 2).toUpperCase(),
    toFormModel: (c) => ({
      name: c.name,
      code: c.code,
      hours: String(c.hours),
      departmentId: departmentIdValue(c),
      instructorId: instructorIdValue(c),
    }),
    optionsLoaders: {
      departmentId: departmentOptions,
      instructorId: instructorOptions,
    },
    detailTitle: (c) => c.name,
    detailSubtitle: (c) => c.code,
    detailInfo: (c) => [
      { label: 'Hours', value: String(c.hours) },
      { label: 'Department', value: departmentName(c) },
      { label: 'Instructor', value: instructorName(c) },
    ],
  };
}
