import { Routes } from '@angular/router';
import { ShellComponent } from './shared/components/shell/shell.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsListComponent } from './features/students/students-list.component';
import { StudentsDetailComponent } from './features/students/students-detail.component';
import { DepartmentsListComponent } from './features/departments/departments-list.component';
import { DepartmentsDetailComponent } from './features/departments/departments-detail.component';
import { InstructorsListComponent } from './features/instructors/instructors-list.component';
import { InstructorsDetailComponent } from './features/instructors/instructors-detail.component';
import { CoursesListComponent } from './features/courses/courses-list.component';
import { CoursesDetailComponent } from './features/courses/courses-detail.component';
import { EnrollmentsListComponent } from './features/enrollments/enrollments-list.component';
import { EnrollmentsDetailComponent } from './features/enrollments/enrollments-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'students', component: StudentsListComponent },
      { path: 'students/:id', component: StudentsDetailComponent },

      { path: 'departments', component: DepartmentsListComponent },
      { path: 'departments/:id', component: DepartmentsDetailComponent },

      { path: 'instructors', component: InstructorsListComponent },
      { path: 'instructors/:id', component: InstructorsDetailComponent },

      { path: 'courses', component: CoursesListComponent },
      { path: 'courses/:id', component: CoursesDetailComponent },

      { path: 'enrollments', component: EnrollmentsListComponent },
      { path: 'enrollments/:id', component: EnrollmentsDetailComponent },

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
