import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../students/student.service';
import { Student } from '../students/student.model';
import { CourseService } from '../courses/course.service';
import { Course } from '../courses/course.model';
import { Enrollment, EnrollmentStatus } from './enrollment.model';
import { LucideX } from '../../shared/icons';

const TERMS = ['Fall 2026', 'Spring 2026', 'Fall 2025'];
const STATUSES: { label: string; value: EnrollmentStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];

@Component({
  selector: 'app-enrollments-form',
  standalone: true,
  imports: [FormsModule, LucideX],
  templateUrl: './enrollments-form.component.html',
  styleUrl: './enrollments-form.component.css',
})
export class EnrollmentsFormComponent implements OnChanges {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initial: Enrollment | null = null;
  @Output() saved = new EventEmitter<Record<string, unknown>>();
  @Output() cancelled = new EventEmitter<void>();

  readonly terms = TERMS;
  readonly statuses = STATUSES;

  students: Student[] = [];
  courses: Course[] = [];
  model = { studentId: '', courseId: '', semester: '', grade: '', status: 'active' as EnrollmentStatus };
  errors: Record<string, string> = {};

  ngOnChanges(): void {
    this.studentService.list().subscribe((res) => (this.students = res.data ?? []));
    this.courseService.list().subscribe((res) => (this.courses = res.data ?? []));

    if (this.initial) {
      const s = this.initial.studentId;
      const c = this.initial.courseId;
      this.model = {
        studentId: s && typeof s === 'object' ? s._id : String(s ?? ''),
        courseId: c && typeof c === 'object' ? c._id : String(c ?? ''),
        semester: this.initial.semester,
        grade: this.initial.grade != null ? String(this.initial.grade) : '',
        status: this.initial.status,
      };
    } else {
      this.model = { studentId: '', courseId: '', semester: '', grade: '', status: 'active' };
    }
    this.errors = {};
  }

  submit(): void {
    const errors: Record<string, string> = {};
    if (!this.model.studentId) errors['studentId'] = 'Student is required';
    if (!this.model.courseId) errors['courseId'] = 'Course is required';
    if (!this.model.semester) errors['semester'] = 'Term is required';
    if (!this.model.status) errors['status'] = 'Status is required';
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.saved.emit({
      studentId: this.model.studentId,
      courseId: this.model.courseId,
      semester: this.model.semester,
      grade: this.model.grade === '' ? undefined : Number(this.model.grade),
      status: this.model.status,
    });
  }
}
