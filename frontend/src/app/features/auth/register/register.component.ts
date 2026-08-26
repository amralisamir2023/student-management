import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { LucideGraduationCap, LucideCheck, LucideAlertCircle } from '../../../shared/icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideGraduationCap, LucideCheck, LucideAlertCircle],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: UserRole = 'user';
  error = '';
  submitting = false;

  submit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in name, email and password.';
      return;
    }
    this.error = '';
    this.submitting = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
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
        this.error = err?.error?.message ?? 'Could not create the account. Please try again.';
      },
    });
  }
}
