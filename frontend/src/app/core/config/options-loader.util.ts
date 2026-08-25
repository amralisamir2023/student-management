import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { SelectOption } from './module-config.model';




export function loadOptions<T extends { _id: string }>(
  list: () => Observable<ApiResponse<T[]>>,
  label: (item: T) => string
): () => Observable<SelectOption[]> {
  return () => list().pipe(map((res) => (res.data ?? []).map((item) => ({ label: label(item), value: item._id }))));
}
