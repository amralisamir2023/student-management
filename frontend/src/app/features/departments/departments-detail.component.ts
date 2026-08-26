import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DepartmentService } from './department.service';
import { Department } from './department.model';
import { DepartmentsFormComponent } from './departments-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucideChevronLeft, LucideLock } from '../../shared/icons';

@Component({
  selector: 'app-departments-detail',
  standalone: true,
  imports: [DepartmentsFormComponent, ConfirmModalComponent, LucideChevronLeft, LucideLock],
  templateUrl: './departments-detail.component.html',
  styleUrl: './departments-detail.component.css',
})
export class DepartmentsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private departmentService = inject(DepartmentService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  department: Department | null = null;
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
    this.departmentService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) this.department = res.data;
        else this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  initials(): string {
    return this.department?.code.slice(0, 2).toUpperCase() ?? '';
  }

  backToList(): void {
    this.router.navigate(['/departments']);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  save(payload: Record<string, unknown>): void {
    if (!this.department) return;
    this.departmentService.update(this.department._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.department = res.data;
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
    if (!this.department) return;
    this.departmentService.remove(this.department._id).subscribe({
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
