import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { StudentService } from './student.service';
import { Student } from './student.model';
import { Department } from '../departments/department.model';
import { StudentsFormComponent } from './students-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucideChevronLeft, LucideLock } from '../../shared/icons';

@Component({
  selector: 'app-students-detail',
  standalone: true,
  imports: [StudentsFormComponent, ConfirmModalComponent, LucideChevronLeft, LucideLock],
  templateUrl: './students-detail.component.html',
  styleUrl: './students-detail.component.css',
})
export class StudentsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  student: Student | null = null;
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
    this.studentService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) this.student = res.data;
        else this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  departmentName(): string {
    const d = this.student?.departmentId as Department;
    return d && typeof d === 'object' ? d.name : String(this.student?.departmentId ?? '—');
  }

  initials(): string {
    const name = this.student?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  backToList(): void {
    this.router.navigate(['/students']);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  save(payload: Record<string, unknown>): void {
    if (!this.student) return;
    this.studentService.update(this.student._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.student = res.data;
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
    if (!this.student) return;
    this.studentService.remove(this.student._id).subscribe({
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
