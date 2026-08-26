import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InstructorService } from './instructor.service';
import { Instructor } from './instructor.model';
import { InstructorsFormComponent } from './instructors-form.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LucideChevronLeft, LucideLock } from '../../shared/icons';

@Component({
  selector: 'app-instructors-detail',
  standalone: true,
  imports: [InstructorsFormComponent, ConfirmModalComponent, LucideChevronLeft, LucideLock],
  templateUrl: './instructors-detail.component.html',
  styleUrl: './instructors-detail.component.css',
})
export class InstructorsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private instructorService = inject(InstructorService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  instructor: Instructor | null = null;
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
    this.instructorService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) this.instructor = res.data;
        else this.notFound = true;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  initials(): string {
    const name = this.instructor?.name ?? '';
    return name
      .replace(/^(Dr\.|Eng\.)\s*/, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  backToList(): void {
    this.router.navigate(['/instructors']);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  save(payload: Record<string, unknown>): void {
    if (!this.instructor) return;
    this.instructorService.update(this.instructor._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.instructor = res.data;
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
    if (!this.instructor) return;
    this.instructorService.remove(this.instructor._id).subscribe({
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
