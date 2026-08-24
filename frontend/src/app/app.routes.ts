import { Routes } from '@angular/router';
import { ShellComponent } from './shared/components/shell/shell.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EntityListComponent } from './shared/components/entity-list/entity-list.component';
import { EntityDetailComponent } from './shared/components/entity-detail/entity-detail.component';

function moduleRoutes(key: string) {
  return [
    { path: key, component: EntityListComponent, data: { module: key } },
    { path: `${key}/:id`, component: EntityDetailComponent, data: { module: key } },
  ];
}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      ...moduleRoutes('students'),
      ...moduleRoutes('departments'),
      ...moduleRoutes('courses'),
      ...moduleRoutes('instructors'),
      ...moduleRoutes('enrollments'),
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
