import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Instructor } from '../models/instructor.model';
import { CrudService } from './crud.service';
import { API_BASE } from '../api-base';

// Real, connected service — talks to backend/controllers/instructorController.js.
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
