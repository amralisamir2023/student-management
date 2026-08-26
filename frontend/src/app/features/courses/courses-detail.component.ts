import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CourseService } from './course.service';
import { Course } from './course.model';
import { Department } from '../departments/department.model';
import { Instructor } from '../instructors/instructor.model';
import { CoursesFormComponent } from './courses-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucideChevronLeft, LucideLock } from '../../shared/icons';

@Component({
  selector: 'app-courses-detail',
  standalone: true,
  imports: [CoursesFormComponent, ConfirmModalComponent, LucideChevronLeft, LucideLock],
  templateUrl: './courses-detail.component.html',
  styleUrl: './courses-detail.component.css',
})
export class CoursesDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  course: Course | null = null;
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
    this.courseService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) this.course = res.data;
        else this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  departmentName(): string {
    const d = this.course?.departmentId as Department;
    return d && typeof d === 'object' ? d.name : this.course?.departmentId ? String(this.course.departmentId) : '—';
  }

  instructorName(): string {
    const i = this.course?.instructorId as Instructor;
    return i && typeof i === 'object' ? i.name : this.course?.instructorId ? String(this.course.instructorId) : '—';
  }

  backToList(): void {
    this.router.navigate(['/courses']);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  save(payload: Record<string, unknown>): void {
    if (!this.course) return;
    this.courseService.update(this.course._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.course = res.data;
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
    if (!this.course) return;
    this.courseService.remove(this.course._id).subscribe({
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
