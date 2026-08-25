import { ModuleConfig } from '../../core/config/module-config.model';
import { Student } from './student.model';
import { Department } from '../departments/department.model';
import { DepartmentService } from '../departments/department.service';
import { loadOptions } from '../../core/config/options-loader.util';

function departmentName(s: Student): string {
  const d = s.departmentId as Department;
  return d && typeof d === 'object' ? d.name : String(s.departmentId ?? '');
}

function departmentIdValue(s: Student): string {
  const d = s.departmentId as Department;
  return d && typeof d === 'object' ? d._id : String(s.departmentId ?? '');
}

export function buildStudentsConfig(departmentService: DepartmentService): ModuleConfig<Student> {
  return {
    key: 'students',
    title: 'Students',
    singular: 'student',
    addLabel: 'Add Student',
    searchPlaceholder: 'Search students',
    layout: 'table',
    filters: [{ key: 'level', label: 'All levels', options: ['1', '2', '3', '4'] }],
    columns: [
      { label: 'Name', render: (s) => s.name, sub: (s) => s.email, isPerson: true },
      { label: 'Phone', render: (s) => s.phone ?? '—', mono: true },
      { label: 'Age', render: (s) => (s.age != null ? String(s.age) : '—') },
      { label: 'Level', render: (s) => (s.level != null ? `Level ${s.level}` : '—'), badgeClass: () => 'badge badge-level' },
      { label: 'Department', render: departmentName, badgeClass: () => 'badge badge-dept' },
    ],
    fields: [
      { key: 'name', label: 'Full name', type: 'text', placeholder: 'Mariam Adel', required: true },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'name@nti.edu', required: true },
      { key: 'phone', label: 'Phone', type: 'text', placeholder: '010 0000 0000' },
      { key: 'age', label: 'Age', type: 'number', placeholder: '20', min: 16, max: 60, parse: (v) => (v === '' ? undefined : Number(v)) },
      {
        key: 'level',
        label: 'Level',
        type: 'select',
        required: true,
        options: [
          { label: 'Level 1', value: '1' },
          { label: 'Level 2', value: '2' },
          { label: 'Level 3', value: '3' },
          { label: 'Level 4', value: '4' },
        ],
        parse: (v) => (v === '' ? undefined : Number(v)),
      },
      { key: 'departmentId', label: 'Department', type: 'select', required: true, full: true },
    ],
    initials: (s) =>
      s.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
    toFormModel: (s) => ({
      name: s.name,
      email: s.email,
      phone: s.phone ?? '',
      age: s.age != null ? String(s.age) : '',
      level: s.level != null ? String(s.level) : '',
      departmentId: departmentIdValue(s),
    }),
    optionsLoaders: {
      departmentId: loadOptions(
        () => departmentService.list(),
        (d) => `${d.name} (${d.code})`
      ),
    },
    detailTitle: (s) => s.name,
    detailSubtitle: (s) => s.email,
    detailInfo: (s) => [
      { label: 'Phone', value: s.phone ?? '—' },
      { label: 'Age', value: s.age != null ? String(s.age) : '—' },
      { label: 'Level', value: s.level != null ? `Level ${s.level}` : '—' },
      { label: 'Department', value: departmentName(s) },
    ],
  };
}
