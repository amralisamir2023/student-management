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
  full?: boolean; 
  hint?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  
  
  parse?: (raw: string) => unknown;
}

export interface ColumnConfig<T> {
  label: string;
  render: (item: T) => string;
  sub?: (item: T) => string; 
  isPerson?: boolean; 
  badgeClass?: (item: T) => string | null; 
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
  
  
  
  optionsLoaders?: Record<string, () => Observable<SelectOption[]>>;
}
