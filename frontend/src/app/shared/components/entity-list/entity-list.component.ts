import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModuleRegistryService } from '../../../core/services/module-registry.service';
import { ModuleConfig, SelectOption } from '../../../core/config/module-config.model';
import { EntityFormModalComponent } from '../entity-form-modal/entity-form-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { LucidePlus, LucideLock, LucideAlertCircle, LucideInbox, LucideEye, LucidePencil, LucideTrash2, LucideSearch } from '../../icons';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    EntityFormModalComponent,
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
  templateUrl: './entity-list.component.html',
})
export class EntityListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private registry = inject(ModuleRegistryService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  moduleKey = '';
  config!: ModuleConfig<any>;
  private service!: ReturnType<ModuleRegistryService['get']>['service'];

  items: any[] = [];
  loading = true;
  loadFailed = false;

  search = '';
  filterValues: Record<string, string> = {};
  resolvedFilterOptions: Record<string, SelectOption[] | undefined> = {};

  modalMode: 'add' | 'edit' | null = null;
  editingItem: any = null;
  deletingItem: any = null;

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.moduleKey = data['module'];
      const entry = this.registry.get(this.moduleKey);
      this.config = entry.config;
      this.service = entry.service;
      this.filterValues = {};
      this.resolvedFilterOptions = {};
      this.search = '';

      for (const fl of this.config.filters) {
        if (fl.optionsLoader) {
          fl.optionsLoader().subscribe((options) => {
            this.resolvedFilterOptions = { ...this.resolvedFilterOptions, [fl.key]: options };
          });
        }
      }

      this.fetch();
    });
  }

  get canEdit(): boolean {
    return this.auth.isAdmin();
  }

  get isGuestBrowsing(): boolean {
    return !this.auth.isAdmin();
  }

  fetch(): void {
    this.loading = true;
    this.loadFailed = false;
    const params: Record<string, string> = {};
    if (this.search) {
      params[this.config.key === 'enrollments' ? 'search' : 'name'] = this.search;
    }
    for (const [k, v] of Object.entries(this.filterValues)) {
      if (v) params[k] = v;
    }

    this.service.list(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.items = res.data ?? [];
        } else {
          this.loadFailed = true;
        }
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

  openAdd(): void {
    this.modalMode = 'add';
    this.editingItem = null;
  }

  openEdit(item: any, ev?: Event): void {
    ev?.stopPropagation();
    this.modalMode = 'edit';
    this.editingItem = item;
  }

  closeModal(): void {
    this.modalMode = null;
    this.editingItem = null;
  }

  submitForm(payload: Record<string, unknown>): void {
    const request$ =
      this.modalMode === 'edit' && this.editingItem
        ? this.service.update(this.editingItem._id, payload)
        : this.service.create(payload);

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
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  askDelete(item: any, ev?: Event): void {
    ev?.stopPropagation();
    this.deletingItem = item;
  }

  cancelDelete(): void {
    this.deletingItem = null;
  }

  confirmDelete(): void {
    const item = this.deletingItem;
    if (!item) return;
    this.service.remove(item._id).subscribe({
      next: (res) => {
        this.deletingItem = null;
        if (res.success) {
          this.toast.success(res.message);
          this.fetch();
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.deletingItem = null;
        this.toast.error(err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  viewItem(item: any): void {
    this.router.navigate(['/', this.moduleKey, item._id]);
  }

  initialsFor(item: any): string {
    return this.config.initials(item);
  }
}
