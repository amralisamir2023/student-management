import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import {
  LucideDynamicIcon,
  LucideGraduationCap,
  LucideLogOut,
  LucideLayoutDashboard,
  LucideUsers,
  LucideBuilding2,
  LucideBookOpen,
  LucideClipboardCheck,
  LucideMenu,
  LucideX,
  LucideSun,
  LucideMoon,
  type LucideIcon,
} from '../../icons';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LucideLayoutDashboard },
  { label: 'Students', path: '/students', icon: LucideUsers },
  { label: 'Departments', path: '/departments', icon: LucideBuilding2 },
  { label: 'Courses', path: '/courses', icon: LucideBookOpen },
  { label: 'Instructors', path: '/instructors', icon: LucideGraduationCap },
  { label: 'Enrollments', path: '/enrollments', icon: LucideClipboardCheck },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastContainerComponent,
    LucideDynamicIcon,
    LucideGraduationCap,
    LucideLogOut,
    LucideMenu,
    LucideX,
    LucideSun,
    LucideMoon,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  theme = inject(ThemeService);

  nav = NAV;
  
  
  
  sidebarOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.sidebarOpen.set(false));
  }

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

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
