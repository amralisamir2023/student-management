import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Instructor } from '../models/instructor.model';
import { CrudService } from './crud.service';

// MOCKED — not connected to the backend yet. Owned by Mirola.
// The real API already exists at /api/instructors (including
// /:id/courses) — see StudentService for the pattern to copy.
@Injectable({ providedIn: 'root' })
export class InstructorService implements CrudService<Instructor> {
  private data: Instructor[] = [
    { _id: 'INS-11', name: 'Dr. Hana Fouad', email: 'h.fouad@nti.edu', phone: '010 1122 3344', specialization: 'Databases' },
    { _id: 'INS-12', name: 'Dr. Omar Saleh', email: 'o.saleh@nti.edu', phone: '011 4455 6677', specialization: 'Algorithms' },
    { _id: 'INS-13', name: 'Eng. Laila Nabil', email: 'l.nabil@nti.edu', phone: '012 7788 9900', specialization: 'Web Development' },
    { _id: 'INS-14', name: 'Dr. Ahmed Ghanem', email: 'a.ghanem@nti.edu', phone: '015 3344 2211', specialization: 'Networks' },
    { _id: 'INS-15', name: 'Eng. Rana Sami', email: 'r.sami@nti.edu', phone: '010 9988 7766', specialization: 'UI Engineering' },
  ];

  list(params?: Record<string, string>): Observable<ApiResponse<Instructor[]>> {
    let results = [...this.data];
    const name = params?.['name'];
    const specialization = params?.['specialization'];
    if (name) {
      const q = name.toLowerCase();
      results = results.filter((i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q));
    }
    if (specialization) {
      results = results.filter((i) => i.specialization === specialization);
    }
    return of({ success: true, message: 'Instructors fetched successfully', data: results }).pipe(delay(250));
  }

  getById(id: string): Observable<ApiResponse<Instructor | null>> {
    const found = this.data.find((i) => i._id === id) ?? null;
    return of(
      found
        ? { success: true, message: 'Instructor fetched successfully', data: found }
        : { success: false, message: 'Instructor not found', data: null }
    ).pipe(delay(200));
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Instructor | null>> {
    const created: Instructor = {
      _id: 'INS-' + Date.now(),
      name: String(payload['name'] ?? ''),
      email: String(payload['email'] ?? ''),
      phone: payload['phone'] ? String(payload['phone']) : undefined,
      specialization: payload['specialization'] ? String(payload['specialization']) : undefined,
    };
    this.data = [created, ...this.data];
    return of({ success: true, message: 'Instructor created successfully', data: created }).pipe(delay(300));
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Instructor | null>> {
    this.data = this.data.map((i) => (i._id === id ? { ...i, ...payload } : i));
    const updated = this.data.find((i) => i._id === id) ?? null;
    return of(
      updated
        ? { success: true, message: 'Instructor updated successfully', data: updated }
        : { success: false, message: 'Instructor not found', data: null }
    ).pipe(delay(300));
  }

  remove(id: string): Observable<ApiResponse<null>> {
    const existed = this.data.some((i) => i._id === id);
    this.data = this.data.filter((i) => i._id !== id);
    return of(
      existed
        ? { success: true, message: 'Instructor deleted successfully', data: null }
        : { success: false, message: 'Instructor not found', data: null }
    ).pipe(delay(250));
  }
}
