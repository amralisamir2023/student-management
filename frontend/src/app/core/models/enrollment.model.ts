import { Student } from './student.model';
import { Course } from './course.model';

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface Enrollment {
  _id: string;
  studentId: Student | string;
  courseId: Course | string;
  semester: string;
  grade?: number;
  status: EnrollmentStatus;
  createdAt?: string;
  updatedAt?: string;
}
