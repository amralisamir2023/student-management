import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Instructor } from './instructor.model';
import { CrudService } from '../../core/services/crud.service';
import { API_BASE } from '../../core/api-base';


@Injectable({ providedIn: 'root' })
export class InstructorService implements CrudService<Instructor> {
  private readonly base = `${API_BASE}/instructors`;

  constructor(private http: HttpClient) {}

  list(params?: Record<string, string>): Observable<ApiResponse<Instructor[]>> {
    return this.http.get<ApiResponse<Instructor[]>>(this.base, { params });
  }

  getById(id: string): Observable<ApiResponse<Instructor | null>> {
    return this.http.get<ApiResponse<Instructor | null>>(`${this.base}/${id}`);
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Instructor | null>> {
    return this.http.post<ApiResponse<Instructor | null>>(this.base, payload);
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Instructor | null>> {
    return this.http.put<ApiResponse<Instructor | null>>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
