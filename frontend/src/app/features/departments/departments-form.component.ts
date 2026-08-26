import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from './department.model';
import { LucideX } from '../../shared/icons';

@Component({
  selector: 'app-departments-form',
  standalone: true,
  imports: [FormsModule, LucideX],
  templateUrl: './departments-form.component.html',
  styleUrl: './departments-form.component.css',
})
export class DepartmentsFormComponent implements OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initial: Department | null = null;
  @Output() saved = new EventEmitter<Record<string, unknown>>();
  @Output() cancelled = new EventEmitter<void>();

  model = { name: '', code: '', description: '' };
  errors: Record<string, string> = {};

  ngOnChanges(): void {
    this.model = this.initial
      ? { name: this.initial.name, code: this.initial.code, description: this.initial.description ?? '' }
      : { name: '', code: '', description: '' };
    this.errors = {};
  }

  submit(): void {
    const errors: Record<string, string> = {};
    if (!this.model.name.trim()) errors['name'] = 'Department name is required';
    if (!this.model.code.trim()) errors['code'] = 'Department code is required';
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.saved.emit({ name: this.model.name, code: this.model.code, description: this.model.description });
  }
}
