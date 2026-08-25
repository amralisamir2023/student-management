import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Course } from './course.model';
import { CrudService } from '../../core/services/crud.service';
import { API_BASE } from '../../core/api-base';


@Injectable({ providedIn: 'root' })
export class CourseService implements CrudService<Course> {
  private readonly base = `${API_BASE}/courses`;

  constructor(private http: HttpClient) {}

  list(params?: Record<string, string>): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.base, { params });
  }

  getById(id: string): Observable<ApiResponse<Course | null>> {
    return this.http.get<ApiResponse<Course | null>>(`${this.base}/${id}`);
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Course | null>> {
    return this.http.post<ApiResponse<Course | null>>(this.base, payload);
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Course | null>> {
    return this.http.put<ApiResponse<Course | null>>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
