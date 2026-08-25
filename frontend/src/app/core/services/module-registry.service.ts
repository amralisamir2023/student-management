import { Injectable } from '@angular/core';
import { ModuleConfig } from '../config/module-config.model';
import { CrudService } from './crud.service';
import { StudentService } from '../../features/students/student.service';
import { DepartmentService } from '../../features/departments/department.service';
import { CourseService } from '../../features/courses/course.service';
import { InstructorService } from '../../features/instructors/instructor.service';
import { EnrollmentService } from '../../features/enrollments/enrollment.service';
import { buildStudentsConfig } from '../../features/students/students.config';
import { DEPARTMENTS_CONFIG } from '../../features/departments/departments.config';
import { buildCoursesConfig } from '../../features/courses/courses.config';
import { INSTRUCTORS_CONFIG } from '../../features/instructors/instructors.config';
import { buildEnrollmentsConfig } from '../../features/enrollments/enrollments.config';

export interface ModuleEntry<T = any> {
  config: ModuleConfig<T>;
  service: CrudService<T>;
}

// Single place the generic list/detail/form components ask "what module is
// this route for, and which config + service does it need?" — keyed by the
// `module` value set on each route's `data` (see app.routes.ts).
//
// Every module here is real, connected to the live backend — see each
// service file (student.service.ts, department.service.ts, etc.) for the
// actual HttpClient calls.
@Injectable({ providedIn: 'root' })
export class ModuleRegistryService {
  private readonly registry: Record<string, ModuleEntry>;

  constructor(
    studentService: StudentService,
    departmentService: DepartmentService,
    courseService: CourseService,
    instructorService: InstructorService,
    enrollmentService: EnrollmentService
  ) {
    this.registry = {
      students: { config: buildStudentsConfig(departmentService), service: studentService },
      departments: { config: DEPARTMENTS_CONFIG, service: departmentService },
      courses: { config: buildCoursesConfig(departmentService, instructorService), service: courseService },
      instructors: { config: INSTRUCTORS_CONFIG, service: instructorService },
      enrollments: { config: buildEnrollmentsConfig(studentService, courseService), service: enrollmentService },
    };
  }

  get(key: string): ModuleEntry {
    const entry = this.registry[key];
    if (!entry) throw new Error(`Unknown module "${key}"`);
    return entry;
  }
}
