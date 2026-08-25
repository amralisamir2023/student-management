import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';





export interface CrudService<T> {
  list(params?: Record<string, string>): Observable<ApiResponse<T[]>>;
  getById(id: string): Observable<ApiResponse<T | null>>;
  create(payload: Record<string, unknown>): Observable<ApiResponse<T | null>>;
  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<T | null>>;
  remove(id: string): Observable<ApiResponse<null>>;
}
