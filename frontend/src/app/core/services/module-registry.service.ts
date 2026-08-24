import { Injectable } from '@angular/core';
import { ModuleConfig } from '../config/module-config.model';
import { CrudService } from './crud.service';
import { StudentService } from './student.service';
import { DepartmentService } from './department.service';
import { CourseService } from './course.service';
import { InstructorService } from './instructor.service';
import { EnrollmentService } from './enrollment.service';
import { DepartmentLookupService } from './department-lookup.service';
import { buildStudentsConfig } from '../config/students.config';
import { DEPARTMENTS_CONFIG } from '../config/departments.config';
import { COURSES_CONFIG } from '../config/courses.config';
import { INSTRUCTORS_CONFIG } from '../config/instructors.config';
import { ENROLLMENTS_CONFIG } from '../config/enrollments.config';

export interface ModuleEntry<T = any> {
  config: ModuleConfig<T>;
  service: CrudService<T>;
}

// Single place the generic list/detail/form components ask "what module is
// this route for, and which config + service does it need?" — keyed by the
// `module` value set on each route's `data` (see app.routes.ts).
@Injectable({ providedIn: 'root' })
export class ModuleRegistryService {
  private readonly registry: Record<string, ModuleEntry>;

  constructor(
    studentService: StudentService,
    departmentService: DepartmentService,
    courseService: CourseService,
    instructorService: InstructorService,
    enrollmentService: EnrollmentService,
    departmentLookup: DepartmentLookupService
  ) {
    this.registry = {
      students: { config: buildStudentsConfig(departmentLookup), service: studentService },
      departments: { config: DEPARTMENTS_CONFIG, service: departmentService },
      courses: { config: COURSES_CONFIG, service: courseService },
      instructors: { config: INSTRUCTORS_CONFIG, service: instructorService },
      enrollments: { config: ENROLLMENTS_CONFIG, service: enrollmentService },
    };
  }

  get(key: string): ModuleEntry {
    const entry = this.registry[key];
    if (!entry) throw new Error(`Unknown module "${key}"`);
    return entry;
  }
}
