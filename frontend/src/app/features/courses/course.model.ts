import { Department } from '../departments/department.model';
import { Instructor } from '../instructors/instructor.model';

export interface Course {
  _id: string;
  name: string;
  code: string;
  hours: number;
  departmentId: Department | string;
  instructorId?: Instructor | string;
  createdAt?: string;
  updatedAt?: string;
}
