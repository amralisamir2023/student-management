import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuthUser, UserRole } from '../models/user.model';
import { API_BASE } from '../api-base';

const STORAGE_KEY = 'sms_auth_user';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Real, connected auth — talks to backend/controllers/authController.js.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(this.readFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  // Only an admin may add/edit/delete anywhere in the app — matches
  // protect + authorize('admin') on the backend routes exactly.
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${API_BASE}/auth/register`, payload).pipe(
      tap((res) => {
        if (res.success) this.persist(res.data);
      })
    );
  }

  login(payload: LoginPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${API_BASE}/auth/login`, payload).pipe(
      tap((res) => {
        if (res.success) this.persist(res.data);
      })
    );
  }

  logout(): void {
    this.persist(null);
  }

  getToken(): string | null {
    return this._currentUser()?.token ?? null;
  }

  private readFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persist(user: AuthUser | null): void {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (e.g. private browsing) — state still
      // works for the current page load, it just won't survive a refresh.
    }
    this._currentUser.set(user);
  }
}
