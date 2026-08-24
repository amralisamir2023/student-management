import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Department } from '../models/department.model';
import { CrudService } from './crud.service';

// MOCKED — not connected to the backend yet. Owned by Amr Tarek.
// To connect it for real: copy the shape of StudentService (backend/routes
// already exist at /api/departments) and delete everything below the
// `private data` seed. Every method already returns the exact same
// { success, message, data } envelope the real API uses, and every screen
// that uses this service (list/detail/form) was built against that
// envelope — so nothing else in the app needs to change when you do.
@Injectable({ providedIn: 'root' })
export class DepartmentService implements CrudService<Department> {
  private data: Department[] = [
    { _id: 'DEP-1', name: 'Computer Science', code: 'CS', description: 'Software engineering, algorithms and systems programming tracks.', createdAt: '2026-01-10T00:00:00Z' },
    { _id: 'DEP-2', name: 'Information Systems', code: 'IS', description: 'Data management, business intelligence and enterprise systems.', createdAt: '2026-01-10T00:00:00Z' },
    { _id: 'DEP-3', name: 'Engineering', code: 'ENG', description: 'Core engineering sciences with an applied computing minor.', createdAt: '2026-01-10T00:00:00Z' },
    { _id: 'DEP-4', name: 'Business Administration', code: 'BA', description: 'Management, finance and project delivery for technical teams.', createdAt: '2026-01-10T00:00:00Z' },
  ];

  list(params?: Record<string, string>): Observable<ApiResponse<Department[]>> {
    let results = [...this.data];
    const name = params?.['name'];
    if (name) {
      const q = name.toLowerCase();
      results = results.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
    }
    return of({ success: true, message: 'Departments fetched successfully', data: results }).pipe(delay(250));
  }

  getById(id: string): Observable<ApiResponse<Department | null>> {
    const found = this.data.find((d) => d._id === id) ?? null;
    return of(
      found
        ? { success: true, message: 'Department fetched successfully', data: found }
        : { success: false, message: 'Department not found', data: null }
    ).pipe(delay(200));
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Department | null>> {
    const created: Department = {
      _id: 'DEP-' + Date.now(),
      name: String(payload['name'] ?? ''),
      code: String(payload['code'] ?? ''),
      description: payload['description'] ? String(payload['description']) : undefined,
      createdAt: new Date().toISOString(),
    };
    this.data = [created, ...this.data];
    return of({ success: true, message: 'Department created successfully', data: created }).pipe(delay(300));
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Department | null>> {
    this.data = this.data.map((d) => (d._id === id ? { ...d, ...payload, updatedAt: new Date().toISOString() } : d));
    const updated = this.data.find((d) => d._id === id) ?? null;
    return of(
      updated
        ? { success: true, message: 'Department updated successfully', data: updated }
        : { success: false, message: 'Department not found', data: null }
    ).pipe(delay(300));
  }

  remove(id: string): Observable<ApiResponse<null>> {
    const existed = this.data.some((d) => d._id === id);
    this.data = this.data.filter((d) => d._id !== id);
    return of(
      existed
        ? { success: true, message: 'Department deleted successfully', data: null }
        : { success: false, message: 'Department not found', data: null }
    ).pipe(delay(250));
  }
}
