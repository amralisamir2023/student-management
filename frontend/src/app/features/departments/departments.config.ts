import { ModuleConfig } from '../../core/config/module-config.model';
import { Department } from './department.model';

export const DEPARTMENTS_CONFIG: ModuleConfig<Department> = {
  key: 'departments',
  title: 'Departments',
  singular: 'department',
  addLabel: 'Add Department',
  searchPlaceholder: 'Search departments',
  layout: 'cards',
  filters: [],
  columns: [],
  fields: [
    { key: 'name', label: 'Department name', type: 'text', placeholder: 'Computer Science', required: true, full: true },
    { key: 'code', label: 'Department code', type: 'text', placeholder: 'CS', required: true },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short summary of the department', full: true },
  ],
  initials: (d) => d.code.slice(0, 2).toUpperCase(),
  cardBadge: (d) => d.code,
  cardBody: (d) => d.description ?? '',
  toFormModel: (d) => ({ name: d.name, code: d.code, description: d.description ?? '' }),
  detailTitle: (d) => d.name,
  detailSubtitle: (d) => d.code,
  detailInfo: (d) => [
    { label: 'Code', value: d.code },
    { label: 'Description', value: d.description ?? '—' },
  ],
};
