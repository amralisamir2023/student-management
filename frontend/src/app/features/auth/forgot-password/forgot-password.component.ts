import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from '../../../core/models/api-response.model';
import { API_BASE } from '../../../core/api-base';
import { LucideGraduationCap, LucideAlertCircle, LucideCheck } from '../../../shared/icons';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideGraduationCap, LucideAlertCircle, LucideCheck],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private http = inject(HttpClient);

  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;
    this.http.post<ApiResponse<null>>(`${API_BASE}/auth/forgot-password`, { email: this.email }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Password reset link sent successfully.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Something went wrong. Please try again.';
      },
    });
  }
}
