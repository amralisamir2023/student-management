import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldConfig, SelectOption } from '../../../core/config/module-config.model';
import { LucideX } from '../../icons';

@Component({
  selector: 'app-entity-form-modal',
  standalone: true,
  imports: [FormsModule, LucideX],
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-soft);display:flex;align-items:flex-start;justify-content:space-between;gap:14px">
          <div>
            <div style="font-size:16.5px;font-weight:800;letter-spacing:-.02em">{{ title }}</div>
            <div style="font-size:11.5px;color:var(--text-faint);margin-top:4px" class="mono">{{ subtitle }}</div>
          </div>
          <button (click)="cancel.emit()" style="width:32px;height:32px;flex:none;border:none;background:#f4f5fa;border-radius:10px;display:flex;align-items:center;justify-content:center" title="Close"><svg lucideX [size]="15"></svg></button>
        </div>

        <div style="padding:22px 24px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
          @for (f of fields; track f.key) {
            <label class="field" [style.grid-column]="f.full ? '1 / -1' : 'auto'">
              <span class="field-label">{{ f.label }}@if (f.required) {<span style="color:var(--danger)"> *</span>}</span>

              @if (f.type === 'select') {
                <select [(ngModel)]="model[f.key]" [name]="f.key">
                  <option value="">Select {{ f.label }}</option>
                  @for (opt of resolvedOptions[f.key] ?? f.options ?? []; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              } @else if (f.type === 'textarea') {
                <textarea [(ngModel)]="model[f.key]" [name]="f.key" rows="3" [placeholder]="f.placeholder ?? ''"></textarea>
              } @else {
                <input
                  [type]="f.type"
                  [(ngModel)]="model[f.key]"
                  [name]="f.key"
                  [placeholder]="f.placeholder ?? ''"
                  [attr.min]="f.min ?? null"
                  [attr.max]="f.max ?? null"
                />
              }

              @if (errors[f.key]) {
                <span class="field-error">{{ errors[f.key] }}</span>
              } @else if (f.hint) {
                <span class="field-hint">{{ f.hint }}</span>
              }
            </label>
          }
        </div>

        <div style="padding:17px 24px;border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end;gap:10px;background:#fbfbfe;border-radius:0 0 18px 18px">
          <button class="btn btn-outline" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="onSubmit()">{{ submitLabel }}</button>
        </div>
      </div>
    </div>
  `,
})
export class EntityFormModalComponent implements OnChanges {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() submitLabel = 'Save';
  @Input() fields: FieldConfig[] = [];
  @Input() initialModel: Record<string, unknown> = {};
  @Input() optionsLoaders?: Record<string, () => import('rxjs').Observable<SelectOption[]>>;

  @Output() submitForm = new EventEmitter<Record<string, unknown>>();
  @Output() cancel = new EventEmitter<void>();

  model: Record<string, any> = {};
  errors: Record<string, string> = {};
  resolvedOptions: Record<string, SelectOption[] | undefined> = {};

  ngOnChanges(): void {
    this.model = { ...this.initialModel };
    this.errors = {};

    if (this.optionsLoaders) {
      for (const key of Object.keys(this.optionsLoaders)) {
        this.optionsLoaders[key]().subscribe((options) => {
          this.resolvedOptions = { ...this.resolvedOptions, [key]: options };
        });
      }
    }
  }

  onSubmit(): void {
    const errors: Record<string, string> = {};
    const payload: Record<string, unknown> = {};

    for (const f of this.fields) {
      const raw = this.model[f.key] ?? '';
      if (f.required && String(raw).trim() === '') {
        errors[f.key] = `${f.label} is required`;
        continue;
      }
      payload[f.key] = f.parse ? f.parse(String(raw)) : raw;
    }

    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.submitForm.emit(payload);
  }
}
