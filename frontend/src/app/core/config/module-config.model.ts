import { Observable } from 'rxjs';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  full?: boolean; // spans both columns in the modal grid
  hint?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  // Converts the raw string form value into whatever the payload actually
  // needs (e.g. "2" -> 2 for Student.level). Defaults to identity.
  parse?: (raw: string) => unknown;
}

export interface ColumnConfig<T> {
  label: string;
  render: (item: T) => string;
  sub?: (item: T) => string; // secondary line under the main cell (id, email...)
  isPerson?: boolean; // shows an avatar with initials
  badgeClass?: (item: T) => string | null; // e.g. 'badge badge-dept'
  mono?: boolean;
  align?: 'right';
}

export interface CardStat {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  // When set, overrides `options` with live data (e.g. real department
  // names/ids for the Courses "filter by department" dropdown).
  optionsLoader?: () => Observable<SelectOption[]>;
}

export interface ModuleConfig<T> {
  key: string;
  title: string;
  singular: string;
  addLabel: string;
  searchPlaceholder: string;
  layout: 'table' | 'cards';
  filters: FilterConfig[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  initials: (item: T) => string;
  cardBadge?: (item: T) => string;
  cardBody?: (item: T) => string;
  cardStats?: (item: T) => CardStat[];
  toFormModel: (item: T) => Record<string, unknown>;
  detailTitle: (item: T) => string;
  detailSubtitle: (item: T) => string;
  detailInfo: (item: T) => { label: string; value: string }[];
  // Only set for fields whose options must be fetched live (e.g. Student's
  // department picker calling the real /api/departments endpoint) instead
  // of coming from a fixed list baked into the config.
  optionsLoaders?: Record<string, () => Observable<SelectOption[]>>;
}
