import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Department } from '../models/department.model';
import { CrudService } from './crud.service';
import { API_BASE } from '../api-base';

// Real, connected service — talks to backend/controllers/departmentController.js.
@Injectable({ providedIn: 'root' })
export class DepartmentService implements CrudService<Department> {
  private readonly base = `${API_BASE}/departments`;

  constructor(private http: HttpClient) {}

  list(params?: Record<string, string>): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.base, { params });
  }

  getById(id: string): Observable<ApiResponse<Department | null>> {
    return this.http.get<ApiResponse<Department | null>>(`${this.base}/${id}`);
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Department | null>> {
    return this.http.post<ApiResponse<Department | null>>(this.base, payload);
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Department | null>> {
    return this.http.put<ApiResponse<Department | null>>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
