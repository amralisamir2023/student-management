import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

// Every module's service (real or mocked) implements this exact shape, so
// the shared list/detail/form components never need to know which module
// they're talking to, and swapping a mocked module for a real one later is
// a one-file change.
export interface CrudService<T> {
  list(params?: Record<string, string>): Observable<ApiResponse<T[]>>;
  getById(id: string): Observable<ApiResponse<T | null>>;
  create(payload: Record<string, unknown>): Observable<ApiResponse<T | null>>;
  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<T | null>>;
  remove(id: string): Observable<ApiResponse<null>>;
}
