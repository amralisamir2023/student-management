export type UserRole = 'admin' | 'user';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}
