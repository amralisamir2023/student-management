import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Instructor } from './instructor.model';
import { LucideX } from '../../shared/icons';

const SPECS = ['Databases', 'Algorithms', 'Web Development', 'Networks', 'UI Engineering'];

@Component({
  selector: 'app-instructors-form',
  standalone: true,
  imports: [FormsModule, LucideX],
  templateUrl: './instructors-form.component.html',
  styleUrl: './instructors-form.component.css',
})
export class InstructorsFormComponent implements OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initial: Instructor | null = null;
  @Output() saved = new EventEmitter<Record<string, unknown>>();
  @Output() cancelled = new EventEmitter<void>();

  readonly specializations = SPECS;
  model = { name: '', email: '', phone: '', specialization: '' };
  errors: Record<string, string> = {};

  ngOnChanges(): void {
    this.model = this.initial
      ? {
          name: this.initial.name,
          email: this.initial.email,
          phone: this.initial.phone ?? '',
          specialization: this.initial.specialization ?? '',
        }
      : { name: '', email: '', phone: '', specialization: '' };
    this.errors = {};
  }

  submit(): void {
    const errors: Record<string, string> = {};
    if (!this.model.name.trim()) errors['name'] = 'Full name is required';
    if (!this.model.email.trim()) errors['email'] = 'Email is required';
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.saved.emit({
      name: this.model.name,
      email: this.model.email,
      phone: this.model.phone,
      specialization: this.model.specialization,
    });
  }
}
