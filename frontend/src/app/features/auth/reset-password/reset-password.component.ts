import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';

  token = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetPassword() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please enter and confirm your new password.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage =
        'Password must be at least 6 characters long.';
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

    this.http
      .post<any>(
        `${this.apiUrl}/reset-password/${this.token}`,
        {
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          this.loading = false;

          this.successMessage =
            response.message || 'Password reset successfully.';

          this.password = '';
          this.confirmPassword = '';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },

        error: (error) => {
          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Something went wrong. Please try again.';
        },
      });
  }
}