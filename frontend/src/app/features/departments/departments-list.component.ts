import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DepartmentService } from './department.service';
import { Department } from './department.model';
import { DepartmentsFormComponent } from './departments-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideSearch } from '../../shared/icons';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DepartmentsFormComponent,
    ConfirmModalComponent,
    LucidePlus,
    LucideLock,
    LucideAlertCircle,
    LucideInbox,
    LucideSearch,
  ],
  templateUrl: './departments-list.component.html',
  styleUrl: './departments-list.component.css',
})
export class DepartmentsListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  departments: Department[] = [];
  loading = true;
  loadFailed = false;

  search = '';

  modalMode: 'add' | 'edit' | null = null;
  editingDepartment: Department | null = null;
  deletingDepartment: Department | null = null;

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

    this.departmentService.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.departments = res.data ?? [];
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

  initialsFor(d: Department): string {
    return d.code.slice(0, 2).toUpperCase();
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.editingDepartment = null;
  }

  openEdit(d: Department, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingDepartment = d;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingDepartment = null;
  }

  save(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingDepartment
        ? this.departmentService.update(this.editingDepartment._id, payload)
        : this.departmentService.create(payload);

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

  askDelete(d: Department, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingDepartment = d;
  }

  cancelDelete(): void {
    this.deletingDepartment = null;
  }

  confirmDelete(): void {
    const d = this.deletingDepartment;
    if (!d) return;
    this.departmentService.remove(d._id).subscribe({
      next: (res) => {
        this.deletingDepartment = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingDepartment = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewDepartment(d: Department): void {
    this.router.navigate(['/departments', d._id]);
  }
}
