import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModuleRegistryService } from '../../../core/services/module-registry.service';
import { ModuleConfig } from '../../../core/config/module-config.model';
import { EntityFormModalComponent } from '../entity-form-modal/entity-form-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-entity-detail',
  standalone: true,
  imports: [EntityFormModalComponent, ConfirmModalComponent],
  templateUrl: './entity-detail.component.html',
})
export class EntityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private registry = inject(ModuleRegistryService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  moduleKey = '';
  config!: ModuleConfig<any>;
  private service!: ReturnType<ModuleRegistryService['get']>['service'];

  item: any = null;
  loading = true;
  notFound = false;

  editing = false;
  deleting = false;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.moduleKey = data['module'];
      const entry = this.registry.get(this.moduleKey);
      this.config = entry.config;
      this.service = entry.service;
      this.load();
    });
    this.route.paramMap.subscribe(() => this.load());
  }

  get canEdit(): boolean {
    return this.auth.isAdmin();
  }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.service) return;
    this.loading = true;
    this.notFound = false;
    this.service.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.item = res.data;
        } else {
          this.notFound = true;
        }
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      },
    });
  }

  backToList(): void {
    this.router.navigate(['/', this.moduleKey]);
  }

  openEdit(): void {
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
  }

  submitEdit(payload: Record<string, unknown>): void {
    this.service.update(this.item._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message);
          this.editing = false;
          this.item = res.data;
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
    this.service.remove(this.item._id).subscribe({
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
