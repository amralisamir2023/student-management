import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '▦' },
  { label: 'Students', path: '/students', icon: '🎓' },
  { label: 'Departments', path: '/departments', icon: '🏛' },
  { label: 'Courses', path: '/courses', icon: '📘' },
  { label: 'Instructors', path: '/instructors', icon: '🧑‍🏫' },
  { label: 'Enrollments', path: '/enrollments', icon: '✅' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nav = NAV;

  get user() {
    return this.auth.currentUser();
  }

  get pageTitle(): string {
    const url = this.router.url;
    const match = this.nav.find((n) => url === n.path || url.startsWith(n.path + '/'));
    return match?.label ?? 'Overview';
  }

  get initials(): string {
    const name = this.user?.name ?? 'Guest';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
