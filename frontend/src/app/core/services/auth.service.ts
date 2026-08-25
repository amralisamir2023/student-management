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


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(this.readFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  
  
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
      
      
    }
    this._currentUser.set(user);
  }
}
