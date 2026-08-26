import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideGraduationCap, LucideCheck, LucideAlertCircle, LucideEye } from '../../../shared/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideGraduationCap, LucideCheck, LucideAlertCircle, LucideEye],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  submitting = false;

  submit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password.';
      return;
    }
    this.error = '';
    this.submitting = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.message ?? 'Could not sign in. Please try again.';
      },
    });
  }

  continueAsGuest(): void {
    this.router.navigate(['/dashboard']);
  }
}
