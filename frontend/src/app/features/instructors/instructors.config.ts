import { ModuleConfig } from '../../core/config/module-config.model';
import { Instructor } from './instructor.model';

const SPECS = ['Databases', 'Algorithms', 'Web Development', 'Networks', 'UI Engineering'];

export const INSTRUCTORS_CONFIG: ModuleConfig<Instructor> = {
  key: 'instructors',
  title: 'Instructors',
  singular: 'instructor',
  addLabel: 'Add Instructor',
  searchPlaceholder: 'Search instructors',
  layout: 'table',
  filters: [{ key: 'specialization', label: 'All specializations', options: SPECS }],
  columns: [
    { label: 'Name', render: (i) => i.name, sub: (i) => i.email, isPerson: true },
    { label: 'Email', render: (i) => i.email, mono: true },
    { label: 'Phone', render: (i) => i.phone ?? '—', mono: true },
    { label: 'Specialization', render: (i) => i.specialization ?? '—', badgeClass: () => 'badge badge-spec' },
  ],
  fields: [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'Dr. Hana Fouad', required: true },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'name@nti.edu', required: true },
    { key: 'phone', label: 'Phone', type: 'text', placeholder: '010 0000 0000' },
    { key: 'specialization', label: 'Specialization', type: 'select', options: SPECS.map((s) => ({ label: s, value: s })) },
  ],
  initials: (i) =>
    i.name
      .replace(/^(Dr\.|Eng\.)\s*/, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
  toFormModel: (i) => ({ name: i.name, email: i.email, phone: i.phone ?? '', specialization: i.specialization ?? '' }),
  detailTitle: (i) => i.name,
  detailSubtitle: (i) => i.email,
  detailInfo: (i) => [
    { label: 'Email', value: i.email },
    { label: 'Phone', value: i.phone ?? '—' },
    { label: 'Specialization', value: i.specialization ?? '—' },
  ],
};
