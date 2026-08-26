import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse } from '../../../core/models/api-response.model';
import { API_BASE } from '../../../core/api-base';
import { LucideGraduationCap, LucideAlertCircle, LucideCheck } from '../../../shared/icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideGraduationCap, LucideAlertCircle, LucideCheck],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private token = this.route.snapshot.paramMap.get('token') ?? '';

  password = '';
  confirmPassword = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please enter and confirm your new password.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token.';
      return;
    }

    this.loading = true;
    this.http.post<ApiResponse<null>>(`${API_BASE}/auth/reset-password/${this.token}`, { password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Password reset successfully.';
        this.password = '';
        this.confirmPassword = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Something went wrong. Please try again.';
      },
    });
  }
}
