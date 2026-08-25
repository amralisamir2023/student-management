import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Enrollment } from './enrollment.model';
import { CrudService } from '../../core/services/crud.service';
import { API_BASE } from '../../core/api-base';







@Injectable({ providedIn: 'root' })
export class EnrollmentService implements CrudService<Enrollment> {
  private readonly base = `${API_BASE}/enrollments`;

  constructor(private http: HttpClient) {}

  list(params?: Record<string, string>): Observable<ApiResponse<Enrollment[]>> {
    return this.http.get<ApiResponse<Enrollment[]>>(this.base, { params });
  }

  getById(id: string): Observable<ApiResponse<Enrollment | null>> {
    return this.http.get<ApiResponse<Enrollment | null>>(`${this.base}/${id}`);
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Enrollment | null>> {
    return this.http.post<ApiResponse<Enrollment | null>>(this.base, payload);
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Enrollment | null>> {
    return this.http.put<ApiResponse<Enrollment | null>>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }

  getByStudent(studentId: string): Observable<ApiResponse<Enrollment[]>> {
    return this.http.get<ApiResponse<Enrollment[]>>(`${this.base}/student/${studentId}`);
  }

  getByCourse(courseId: string): Observable<ApiResponse<Enrollment[]>> {
    return this.http.get<ApiResponse<Enrollment[]>>(`${this.base}/course/${courseId}`);
  }
}
