import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InstructorService } from './instructor.service';
import { Instructor } from './instructor.model';
import { InstructorsFormComponent } from './instructors-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideEye, LucidePencil, LucideTrash2, LucideSearch } from '../../shared/icons';

const SPECS = ['Databases', 'Algorithms', 'Web Development', 'Networks', 'UI Engineering'];

@Component({
  selector: 'app-instructors-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    InstructorsFormComponent,
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
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.css',
})
export class InstructorsListComponent implements OnInit {
  private instructorService = inject(InstructorService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  readonly specializations = SPECS;

  instructors: Instructor[] = [];
  loading = true;
  loadFailed = false;

  search = '';
  specializationFilter = '';

  modalMode: 'add' | 'edit' | null = null;
  editingInstructor: Instructor | null = null;
  deletingInstructor: Instructor | null = null;

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
    if (this.specializationFilter) params['specialization'] = this.specializationFilter;

    this.instructorService.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.instructors = res.data ?? [];
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

  initialsFor(i: Instructor): string {
    return i.name
      .replace(/^(Dr\.|Eng\.)\s*/, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.editingInstructor = null;
  }

  openEdit(i: Instructor, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingInstructor = i;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingInstructor = null;
  }

  save(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingInstructor
        ? this.instructorService.update(this.editingInstructor._id, payload)
        : this.instructorService.create(payload);

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

  askDelete(i: Instructor, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingInstructor = i;
  }

  cancelDelete(): void {
    this.deletingInstructor = null;
  }

  confirmDelete(): void {
    const i = this.deletingInstructor;
    if (!i) return;
    this.instructorService.remove(i._id).subscribe({
      next: (res) => {
        this.deletingInstructor = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingInstructor = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewInstructor(i: Instructor): void {
    this.router.navigate(['/instructors', i._id]);
  }
}
