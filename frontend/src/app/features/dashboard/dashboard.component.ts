import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { DepartmentService } from '../../core/services/department.service';
import { CourseService } from '../../core/services/course.service';
import { InstructorService } from '../../core/services/instructor.service';
import { EnrollmentService } from '../../core/services/enrollment.service';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  live: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private students = inject(StudentService);
  private departments = inject(DepartmentService);
  private courses = inject(CourseService);
  private instructors = inject(InstructorService);
  private enrollments = inject(EnrollmentService);

  stats: StatCard[] = [
    { label: 'Students', value: '—', icon: '🎓', live: true },
    { label: 'Departments', value: '—', icon: '🏛', live: false },
    { label: 'Courses', value: '—', icon: '📘', live: false },
    { label: 'Instructors', value: '—', icon: '🧑‍🏫', live: false },
    { label: 'Enrollments', value: '—', icon: '✅', live: false },
  ];

  recentEnrollments: { student: string; course: string; status: string; grade: string; badgeClass: string }[] = [];

  ngOnInit(): void {
    this.students.list().subscribe((res) => this.setStat('Students', String(res.data?.length ?? 0)));
    this.departments.list().subscribe((res) => this.setStat('Departments', String(res.data?.length ?? 0)));
    this.courses.list().subscribe((res) => this.setStat('Courses', String(res.data?.length ?? 0)));
    this.instructors.list().subscribe((res) => this.setStat('Instructors', String(res.data?.length ?? 0)));
    this.enrollments.list().subscribe((res) => {
      this.setStat('Enrollments', String(res.data?.length ?? 0));
      this.recentEnrollments = (res.data ?? []).slice(0, 5).map((e) => ({
        student: String(e.studentId),
        course: String(e.courseId),
        status: e.status[0].toUpperCase() + e.status.slice(1),
        grade: e.grade != null ? String(e.grade) : '—',
        badgeClass: `badge badge-${e.status}`,
      }));
    });
  }

  private setStat(label: string, value: string): void {
    this.stats = this.stats.map((s) => (s.label === label ? { ...s, value } : s));
  }
}
