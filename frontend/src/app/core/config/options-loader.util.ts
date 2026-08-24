import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { SelectOption } from './module-config.model';

// Turns any module's list() call into a live SelectOption[] loader for a
// <select> field/filter — used wherever one module's form needs to
// reference another module's real records (e.g. Course's Department picker).
export function loadOptions<T extends { _id: string }>(
  list: () => Observable<ApiResponse<T[]>>,
  label: (item: T) => string
): () => Observable<SelectOption[]> {
  return () => list().pipe(map((res) => (res.data ?? []).map((item) => ({ label: label(item), value: item._id }))));
}
