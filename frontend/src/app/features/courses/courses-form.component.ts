import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../departments/department.service';
import { Department } from '../departments/department.model';
import { InstructorService } from '../instructors/instructor.service';
import { Instructor } from '../instructors/instructor.model';
import { Course } from './course.model';
import { LucideX } from '../../shared/icons';

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [FormsModule, LucideX],
  templateUrl: './courses-form.component.html',
  styleUrl: './courses-form.component.css',
})
export class CoursesFormComponent implements OnChanges {
  private departmentService = inject(DepartmentService);
  private instructorService = inject(InstructorService);

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initial: Course | null = null;
  @Output() saved = new EventEmitter<Record<string, unknown>>();
  @Output() cancelled = new EventEmitter<void>();

  departments: Department[] = [];
  instructors: Instructor[] = [];
  model = { name: '', code: '', hours: '', departmentId: '', instructorId: '' };
  errors: Record<string, string> = {};

  ngOnChanges(): void {
    this.departmentService.list().subscribe((res) => (this.departments = res.data ?? []));
    this.instructorService.list().subscribe((res) => (this.instructors = res.data ?? []));

    if (this.initial) {
      const dept = this.initial.departmentId;
      const instr = this.initial.instructorId;
      this.model = {
        name: this.initial.name,
        code: this.initial.code,
        hours: String(this.initial.hours),
        departmentId: dept && typeof dept === 'object' ? dept._id : String(dept ?? ''),
        instructorId: instr && typeof instr === 'object' ? instr._id : String(instr ?? ''),
      };
    } else {
      this.model = { name: '', code: '', hours: '', departmentId: '', instructorId: '' };
    }
    this.errors = {};
  }

  submit(): void {
    const errors: Record<string, string> = {};
    if (!this.model.name.trim()) errors['name'] = 'Course name is required';
    if (!this.model.code.trim()) errors['code'] = 'Course code is required';
    if (!this.model.hours || Number(this.model.hours) < 1) errors['hours'] = 'Credit hours must be at least 1';
    if (!this.model.departmentId) errors['departmentId'] = 'Department is required';
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.saved.emit({
      name: this.model.name,
      code: this.model.code,
      hours: Number(this.model.hours),
      departmentId: this.model.departmentId,
      instructorId: this.model.instructorId || undefined,
    });
  }
}
