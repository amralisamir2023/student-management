import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.model';
import { Student } from '../students/student.model';
import { Course } from '../courses/course.model';
import { EnrollmentsFormComponent } from './enrollments-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucideChevronLeft, LucideLock } from '../../shared/icons';

@Component({
  selector: 'app-enrollments-detail',
  standalone: true,
  imports: [EnrollmentsFormComponent, ConfirmModalComponent, LucideChevronLeft, LucideLock],
  templateUrl: './enrollments-detail.component.html',
  styleUrl: './enrollments-detail.component.css',
})
export class EnrollmentsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private enrollmentService = inject(EnrollmentService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  enrollment: Enrollment | null = null;
  loading = true;
  notFound = false;

  editing = false;
  deleting = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.load());
  }

  get canEdit(): boolean {
    return this.auth.isAdmin();
  }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.notFound = false;
    this.enrollmentService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) this.enrollment = res.data;
        else this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  studentLabel(): string {
    const s = this.enrollment?.studentId as Student;
    return s && typeof s === 'object' ? s.name : this.enrollment?.studentId ? String(this.enrollment.studentId) : 'Deleted student';
  }

  courseLabel(): string {
    const c = this.enrollment?.courseId as Course;
    return c && typeof c === 'object' ? `${c.name} (${c.code})` : this.enrollment?.courseId ? String(this.enrollment.courseId) : 'Deleted course';
  }

  statusLabel(): string {
    const status = this.enrollment?.status ?? '';
    return status ? status[0].toUpperCase() + status.slice(1) : '—';
  }

  initials(): string {
    return this.studentLabel()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  backToList(): void {
    this.router.navigate(['/enrollments']);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  save(payload: Record<string, unknown>): void {
    if (!this.enrollment) return;
    this.enrollmentService.update(this.enrollment._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.enrollment = res.data;
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.'),
    });
  }

  askDelete(): void {
    this.deleting = true;
  }

  cancelDelete(): void {
    this.deleting = false;
  }

  confirmDelete(): void {
    if (!this.enrollment) return;
    this.enrollmentService.remove(this.enrollment._id).subscribe({
      next: (res) => {
        this.deleting = false;
        if (res.success) {
          this.toast.success(res.message);
          this.backToList();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deleting = false;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}
