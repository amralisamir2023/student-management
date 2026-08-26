import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CourseService } from './course.service';
import { Course } from './course.model';
import { DepartmentService } from '../departments/department.service';
import { Department } from '../departments/department.model';
import { Instructor } from '../instructors/instructor.model';
import { CoursesFormComponent } from './courses-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideEye, LucidePencil, LucideTrash2, LucideSearch } from '../../shared/icons';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CoursesFormComponent,
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
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css',
})
export class CoursesListComponent implements OnInit {
  private courseService = inject(CourseService);
  private departmentService = inject(DepartmentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  courses: Course[] = [];
  departments: Department[] = [];
  loading = true;
  loadFailed = false;

  search = '';
  departmentFilter = '';

  modalMode: 'add' | 'edit' | null = null;
  editingCourse: Course | null = null;
  deletingCourse: Course | null = null;

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.departmentService.list().subscribe((res) => (this.departments = res.data ?? []));
    this.fetch();
  }

  get canEdit(): boolean {
    return this.auth.isAdmin();
  }

  fetch(): void {
    this.loading = true;
    this.loadFailed = false;
    const params: Record<string, string> = {};
    if (this.search) params['name'] = this.search;
    if (this.departmentFilter) params['departmentId'] = this.departmentFilter;

    this.courseService.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.courses = res.data ?? [];
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

  departmentName(c: Course): string {
    const d = c.departmentId as Department;
    return d && typeof d === 'object' ? d.name : c.departmentId ? String(c.departmentId) : '—';
  }

  instructorName(c: Course): string {
    const i = c.instructorId as Instructor;
    return i && typeof i === 'object' ? i.name : c.instructorId ? String(c.instructorId) : '—';
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.editingCourse = null;
  }

  openEdit(c: Course, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingCourse = c;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingCourse = null;
  }

  save(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingCourse
        ? this.courseService.update(this.editingCourse._id, payload)
        : this.courseService.create(payload);

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

  askDelete(c: Course, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingCourse = c;
  }

  cancelDelete(): void {
    this.deletingCourse = null;
  }

  confirmDelete(): void {
    const c = this.deletingCourse;
    if (!c) return;
    this.courseService.remove(c._id).subscribe({
      next: (res) => {
        this.deletingCourse = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingCourse = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewCourse(c: Course): void {
    this.router.navigate(['/courses', c._id]);
  }
}
