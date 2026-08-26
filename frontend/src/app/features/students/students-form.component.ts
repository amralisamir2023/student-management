import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../departments/department.service';
import { Department } from '../departments/department.model';
import { Student } from './student.model';
import { LucideX } from '../../shared/icons';

@Component({
  selector: 'app-students-form',
  standalone: true,
  imports: [FormsModule, LucideX],
  templateUrl: './students-form.component.html',
  styleUrl: './students-form.component.css',
})
export class StudentsFormComponent implements OnChanges {
  private departmentService = inject(DepartmentService);

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initial: Student | null = null;
  @Output() saved = new EventEmitter<Record<string, unknown>>();
  @Output() cancelled = new EventEmitter<void>();

  departments: Department[] = [];
  model = { name: '', email: '', phone: '', age: '', level: '', departmentId: '' };
  errors: Record<string, string> = {};

  ngOnChanges(): void {
    this.departmentService.list().subscribe((res) => {
      this.departments = res.data ?? [];
    });

    if (this.initial) {
      const dept = this.initial.departmentId;
      this.model = {
        name: this.initial.name,
        email: this.initial.email,
        phone: this.initial.phone ?? '',
        age: this.initial.age != null ? String(this.initial.age) : '',
        level: this.initial.level != null ? String(this.initial.level) : '',
        departmentId: dept && typeof dept === 'object' ? dept._id : String(dept ?? ''),
      };
    } else {
      this.model = { name: '', email: '', phone: '', age: '', level: '', departmentId: '' };
    }
    this.errors = {};
  }

  submit(): void {
    const errors: Record<string, string> = {};
    if (!this.model.name.trim()) errors['name'] = 'Full name is required';
    if (!this.model.email.trim()) errors['email'] = 'Email is required';
    if (!this.model.level) errors['level'] = 'Level is required';
    if (!this.model.departmentId) errors['departmentId'] = 'Department is required';
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.saved.emit({
      name: this.model.name,
      email: this.model.email,
      phone: this.model.phone,
      age: this.model.age === '' ? undefined : Number(this.model.age),
      level: Number(this.model.level),
      departmentId: this.model.departmentId,
    });
  }
}
