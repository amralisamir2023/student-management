import { Department } from '../departments/department.model';

// departmentId comes back populated (a full Department object) on every read
// from the real API, but must be sent as a plain department _id string on
// create/update — see StudentService.
export interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  level?: number;
  departmentId: Department | string;
  createdAt?: string;
  updatedAt?: string;
}
