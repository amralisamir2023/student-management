import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.model';
import { Student } from '../students/student.model';
import { Course } from '../courses/course.model';
import { EnrollmentsFormComponent } from './enrollments-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideEye, LucidePencil, LucideTrash2, LucideSearch } from '../../shared/icons';

const TERMS = ['Fall 2026', 'Spring 2026', 'Fall 2025'];

@Component({
  selector: 'app-enrollments-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    EnrollmentsFormComponent,
    ConfirmModalComponent,
    LucidePlus,
    LucideLock,
    LucideAlertCircle,
    LucideInbox,
    LucideEye,
    LucidePencil,
    LucideTrash2,
    LucideSearch,
  ],
  templateUrl: './enrollments-list.component.html',
  styleUrl: './enrollments-list.component.css',
})
export class EnrollmentsListComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  readonly terms = TERMS;

  enrollments: Enrollment[] = [];
  loading = true;
  loadFailed = false;

  search = '';
  termFilter = '';

  modalMode: 'add' | 'edit' | null = null;
  editingEnrollment: Enrollment | null = null;
  deletingEnrollment: Enrollment | null = null;

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.fetch();
  }

  get canEdit(): boolean {
    return this.auth.isAdmin();
  }

  fetch(): void {
    this.loading = true;
    this.loadFailed = false;
    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.termFilter) params['semester'] = this.termFilter;

    this.enrollmentService.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.enrollments = res.data ?? [];
        else this.loadFailed = true;
      },
      error: () => {
        this.loading = false;
        this.loadFailed = true;
      },
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => this.fetch(), 350);
  }

  onFilterChange(): void {
    this.fetch();
  }

  studentLabel(e: Enrollment): string {
    const s = e.studentId as Student;
    return s && typeof s === 'object' ? s.name : e.studentId ? String(e.studentId) : 'Deleted student';
  }

  courseLabel(e: Enrollment): string {
    const c = e.courseId as Course;
    return c && typeof c === 'object' ? `${c.name} (${c.code})` : e.courseId ? String(e.courseId) : 'Deleted course';
  }

  statusLabel(e: Enrollment): string {
    return e.status[0].toUpperCase() + e.status.slice(1);
  }

  statusClass(e: Enrollment): string {
    return `badge badge-${e.status}`;
  }

  initialsFor(e: Enrollment): string {
    return this.studentLabel(e)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.editingEnrollment = null;
  }

  openEdit(e: Enrollment, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingEnrollment = e;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingEnrollment = null;
  }

  save(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingEnrollment
        ? this.enrollmentService.update(this.editingEnrollment._id, payload)
        : this.enrollmentService.create(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.closeModal();
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.'),
    });
  }

  askDelete(e: Enrollment, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingEnrollment = e;
  }

  cancelDelete(): void {
    this.deletingEnrollment = null;
  }

  confirmDelete(): void {
    const e = this.deletingEnrollment;
    if (!e) return;
    this.enrollmentService.remove(e._id).subscribe({
      next: (res) => {
        this.deletingEnrollment = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingEnrollment = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewEnrollment(e: Enrollment): void {
    this.router.navigate(['/enrollments', e._id]);
  }
}
