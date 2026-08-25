import { Department } from '../departments/department.model';




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
