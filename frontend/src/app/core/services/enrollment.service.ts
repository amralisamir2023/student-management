import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Enrollment } from '../models/enrollment.model';
import { CrudService } from './crud.service';

// MOCKED — not connected to the backend yet. Owned by Radwa.
// The real API already exists at /api/enrollments (including the 409
// duplicate check on studentId+courseId+semester, and /student/:id +
// /course/:id) — see StudentService for the pattern to copy.
// studentId/courseId are the student/course *names* here (not real ids)
// purely so this mock reads nicely on its own.
@Injectable({ providedIn: 'root' })
export class EnrollmentService implements CrudService<Enrollment> {
  private data: Enrollment[] = [
    { _id: 'ENR-501', studentId: 'Mariam Adel' as any, courseId: 'Data Structures' as any, semester: 'Fall 2026', status: 'active' },
    { _id: 'ENR-502', studentId: 'Mariam Adel' as any, courseId: 'Web Development' as any, semester: 'Fall 2026', status: 'active' },
    { _id: 'ENR-503', studentId: 'Youssef Kamal' as any, courseId: 'Linear Algebra' as any, semester: 'Fall 2026', status: 'active' },
    { _id: 'ENR-504', studentId: 'Nour Hassan' as any, courseId: 'Database Systems' as any, semester: 'Spring 2026', grade: 88, status: 'completed' },
    { _id: 'ENR-505', studentId: 'Omar Tarek' as any, courseId: 'Project Management' as any, semester: 'Spring 2026', grade: 74, status: 'completed' },
    { _id: 'ENR-506', studentId: 'Karim Fathy' as any, courseId: 'Database Systems' as any, semester: 'Fall 2025', status: 'dropped' },
    { _id: 'ENR-507', studentId: 'Salma Ibrahim' as any, courseId: 'Operating Systems' as any, semester: 'Fall 2026', status: 'active' },
  ];

  list(params?: Record<string, string>): Observable<ApiResponse<Enrollment[]>> {
    let results = [...this.data];
    const semester = params?.['semester'];
    const search = params?.['search'];
    if (semester) {
      results = results.filter((e) => e.semester === semester);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (e) => String(e.studentId).toLowerCase().includes(q) || String(e.courseId).toLowerCase().includes(q)
      );
    }
    return of({ success: true, message: 'Enrollments fetched successfully', data: results }).pipe(delay(250));
  }

  getById(id: string): Observable<ApiResponse<Enrollment | null>> {
    const found = this.data.find((e) => e._id === id) ?? null;
    return of(
      found
        ? { success: true, message: 'Enrollment fetched successfully', data: found }
        : { success: false, message: 'Enrollment not found', data: null }
    ).pipe(delay(200));
  }

  create(payload: Record<string, unknown>): Observable<ApiResponse<Enrollment | null>> {
    const studentId = (payload['studentId'] as string) ?? '';
    const courseId = (payload['courseId'] as string) ?? '';
    const semester = (payload['semester'] as string) ?? '';

    const isDuplicate = this.data.some(
      (e) => String(e.studentId) === studentId && String(e.courseId) === courseId && e.semester === semester
    );
    if (isDuplicate) {
      return of({
        success: false,
        message: 'Student is already enrolled in this course for this semester',
        data: null,
      }).pipe(delay(300));
    }

    const created: Enrollment = {
      _id: 'ENR-' + Date.now(),
      studentId: studentId as any,
      courseId: courseId as any,
      semester,
      grade: payload['grade'] !== undefined && payload['grade'] !== '' ? Number(payload['grade']) : undefined,
      status: ((payload['status'] as string) || 'active') as Enrollment['status'],
    };
    this.data = [created, ...this.data];
    return of({ success: true, message: 'Student enrolled successfully', data: created }).pipe(delay(300));
  }

  update(id: string, payload: Record<string, unknown>): Observable<ApiResponse<Enrollment | null>> {
    this.data = this.data.map((e) =>
      e._id === id
        ? { ...e, ...payload, grade: payload['grade'] !== undefined ? Number(payload['grade']) : e.grade }
        : e
    );
    const updated = this.data.find((e) => e._id === id) ?? null;
    return of(
      updated
        ? { success: true, message: 'Enrollment updated successfully', data: updated }
        : { success: false, message: 'Enrollment not found', data: null }
    ).pipe(delay(300));
  }

  remove(id: string): Observable<ApiResponse<null>> {
    const existed = this.data.some((e) => e._id === id);
    this.data = this.data.filter((e) => e._id !== id);
    return of(
      existed
        ? { success: true, message: 'Enrollment deleted successfully', data: null }
        : { success: false, message: 'Enrollment not found', data: null }
    ).pipe(delay(250));
  }
}
