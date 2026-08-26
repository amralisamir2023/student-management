import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { StudentService } from './student.service';
import { Student } from './student.model';
import { Department } from '../departments/department.model';
import { StudentsFormComponent } from './students-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideEye, LucidePencil, LucideTrash2, LucideSearch } from '../../shared/icons';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    StudentsFormComponent,
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
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.css',
})
export class StudentsListComponent implements OnInit {
  private studentService = inject(StudentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  students: Student[] = [];
  loading = true;
  loadFailed = false;

  search = '';
  levelFilter = '';

  modalMode: 'add' | 'edit' | null = null;
  editingStudent: Student | null = null;
  deletingStudent: Student | null = null;

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
    if (this.search) params['name'] = this.search;
    if (this.levelFilter) params['level'] = this.levelFilter;

    this.studentService.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.students = res.data ?? [];
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

  departmentName(s: Student): string {
    const d = s.departmentId as Department;
    return d && typeof d === 'object' ? d.name : String(s.departmentId ?? '—');
  }

  initialsFor(s: Student): string {
    return s.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.editingStudent = null;
  }

  openEdit(s: Student, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingStudent = s;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingStudent = null;
  }

  save(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingStudent
        ? this.studentService.update(this.editingStudent._id, payload)
        : this.studentService.create(payload);

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

  askDelete(s: Student, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingStudent = s;
  }

  cancelDelete(): void {
    this.deletingStudent = null;
  }

  confirmDelete(): void {
    const s = this.deletingStudent;
    if (!s) return;
    this.studentService.remove(s._id).subscribe({
      next: (res) => {
        this.deletingStudent = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingStudent = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewStudent(s: Student): void {
    this.router.navigate(['/students', s._id]);
  }
}
