import { Student } from '../students/student.model';
import { Course } from '../courses/course.model';

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
