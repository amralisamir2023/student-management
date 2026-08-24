import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Course } from '../models/course.model';
import { CrudService } from './crud.service';

// MOCKED — not connected to the backend yet. Owned by Salah.
// The real API already exists at /api/courses — see StudentService for the
// pattern to copy. departmentId/instructorId here are the department/
// instructor *names* (not real ids) purely so this mock reads nicely on
// its own; the real service must send real ObjectId strings instead.
@Injectable({ providedIn: 'root' })
export class CourseService implements CrudService<Course> {
  private data: Course[] = [
    { _id: 'CRS-201', name: 'Data Structures', code: 'CS201', hours: 3, departmentId: 'Computer Science' as any, instructorId: 'Dr. Omar Saleh' as any },
    { _id: 'CRS-305', name: 'Database Systems', code: 'IS305', hours: 4, departmentId: 'Information Systems' as any, instructorId: 'Dr. Hana Fouad' as any },
    { _id: 'CRS-110', name: 'Linear Algebra', code: 'MTH110', hours: 3, departmentId: 'Engineering' as any },
    { _id: 'CRS-220', name: 'Web Development', code: 'CS220', hours: 4, departmentId: 'Computer Science' as any, instructorId: 'Eng. Laila Nabil' as any },
    { _id: 'CRS-410', name: 'Project Management', code: 'BA410', hours: 2, departmentId: 'Business Administration' as any, instructorId: 'Eng. Rana Sami' as any },
    { _id: 'CRS-330', name: 'Operating Systems', code: 'CS330', hours: 3, departmentId: 'Computer Science' as any, instructorId: 'Dr. Ahmed Ghanem' as any },
  ];

  list(params?: Record<string, string>): Observable<ApiResponse<Course[]>> {
    let results = [...this.data];
    const name = params?.['name'];
    const departmentId = params?.['departmentId'];
    if (name) {
      const q = name.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    if (departmentId) {
      results = results.filter((c) => c.departmentId === departmentId);
    }
    return of({ success: true, message: 'Courses fetched successfully', data: results }).pipe(delay(250));
  }

  getById(id: string): Observable<ApiResponse<Course | null>> {
    const found = this.data.find((c) => c._id === id) ?? null;
    return of(
      found
        ? { success: true, message: 'Course fetched successfully', data: found }
        : { success: false, message: 'Course not found', data: null }
    ).pipe(delay(200));
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Course | null>> {
    const created: Course = {
      _id: 'CRS-' + Date.now(),
      name: String(payload['name'] ?? ''),
      code: String(payload['code'] ?? ''),
      hours: Number(payload['hours'] ?? 0),
      departmentId: (payload['departmentId'] as string) ?? '',
      instructorId: (payload['instructorId'] as string) || undefined,
    };
    this.data = [created, ...this.data];
    return of({ success: true, message: 'Course created successfully', data: created }).pipe(delay(300));
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Course | null>> {
    this.data = this.data.map((c) => (c._id === id ? { ...c, ...payload, hours: Number(payload['hours'] ?? c.hours) } : c));
    const updated = this.data.find((c) => c._id === id) ?? null;
    return of(
      updated
        ? { success: true, message: 'Course updated successfully', data: updated }
        : { success: false, message: 'Course not found', data: null }
    ).pipe(delay(300));
  }

  remove(id: string): Observable<ApiResponse<null>> {
    const existed = this.data.some((c) => c._id === id);
    this.data = this.data.filter((c) => c._id !== id);
    return of(
      existed
        ? { success: true, message: 'Course deleted successfully', data: null }
        : { success: false, message: 'Course not found', data: null }
    ).pipe(delay(250));
  }
}
