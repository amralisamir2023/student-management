import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  submit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;

    this.http
      .post<any>(`${this.apiUrl}/forgot-password`, {
        email: this.email,
      })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage =
            response.message ||
            'Password reset link sent successfully.';
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