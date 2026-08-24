import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Student } from '../models/student.model';
import { CrudService } from './crud.service';
import { API_BASE } from '../api-base';

// Real, connected service — talks to backend/controllers/studentController.js.
// This is the one module wired end-to-end to the live backend + database.
@Injectable({ providedIn: 'root' })
export class StudentService implements CrudService<Student> {
  private readonly base = `${API_BASE}/students`;

  constructor(private http: HttpClient) {}

  list(params?: Record<string, string>): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(this.base, { params });
  }

  getById(id: string): Observable<ApiResponse<Student | null>> {
    return this.http.get<ApiResponse<Student | null>>(`${this.base}/${id}`);
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Student | null>> {
    return this.http.post<ApiResponse<Student | null>>(this.base, payload);
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Student | null>> {
    return this.http.put<ApiResponse<Student | null>>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
