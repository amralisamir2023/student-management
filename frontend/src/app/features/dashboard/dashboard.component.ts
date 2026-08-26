import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../features/students/student.service';
import { DepartmentService } from '../../features/departments/department.service';
import { CourseService } from '../../features/courses/course.service';
import { InstructorService } from '../../features/instructors/instructor.service';
import { EnrollmentService } from '../../features/enrollments/enrollment.service';
import {
  LucideDynamicIcon,
  LucideUsers,
  LucideBuilding2,
  LucideBookOpen,
  LucideGraduationCap,
  LucideClipboardCheck,
  type LucideIcon,
} from '../../shared/icons';

interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  live: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideDynamicIcon],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private students = inject(StudentService);
  private departments = inject(DepartmentService);
  private courses = inject(CourseService);
  private instructors = inject(InstructorService);
  private enrollments = inject(EnrollmentService);

  stats: StatCard[] = [
    { label: 'Students', value: '—', icon: LucideUsers, live: true },
    { label: 'Departments', value: '—', icon: LucideBuilding2, live: true },
    { label: 'Courses', value: '—', icon: LucideBookOpen, live: true },
    { label: 'Instructors', value: '—', icon: LucideGraduationCap, live: true },
    { label: 'Enrollments', value: '—', icon: LucideClipboardCheck, live: true },
  ];

  recentEnrollments: { student: string; course: string; status: string; grade: string; badgeClass: string }[] = [];
  departmentBreakdown: { name: string; count: number; pct: number }[] = [];

  ngOnInit(): void {
    this.students.list().subscribe((res) => {
      const list = res.data ?? [];
      this.setStat('Students', String(list.length));

      const counts = new Map<string, number>();
      for (const s of list) {
        const dept = s.departmentId as any;
        const name = dept && typeof dept === 'object' ? dept.name : 'Unassigned';
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
      const max = Math.max(1, ...counts.values());
      this.departmentBreakdown = [...counts.entries()]
        .map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }))
        .sort((a, b) => b.count - a.count);
    });
    this.departments.list().subscribe((res) => this.setStat('Departments', String(res.data?.length ?? 0)));
    this.courses.list().subscribe((res) => this.setStat('Courses', String(res.data?.length ?? 0)));
    this.instructors.list().subscribe((res) => this.setStat('Instructors', String(res.data?.length ?? 0)));
    this.enrollments.list().subscribe((res) => {
      this.setStat('Enrollments', String(res.data?.length ?? 0));
      this.recentEnrollments = (res.data ?? []).slice(0, 5).map((e) => {
        
        
        const student = e.studentId as any;
        const course = e.courseId as any;
        return {
          student: student && typeof student === 'object' ? student.name : student ? String(student) : 'Deleted student',
          course: course && typeof course === 'object' ? course.name : course ? String(course) : 'Deleted course',
          status: e.status[0].toUpperCase() + e.status.slice(1),
          grade: e.grade != null ? String(e.grade) : '—',
          badgeClass: `badge badge-${e.status}`,
        };
      });
    });
  }

  private setStat(label: string, value: string): void {
    this.stats = this.stats.map((s) => (s.label === label ? { ...s, value } : s));
  }
}
