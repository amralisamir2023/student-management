

















require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Department = require('./models/Department');
const Instructor = require('./models/Instructor');
const Course = require('./models/Course');
const Student = require('./models/Student');
const Enrollment = require('./models/Enrollment');

const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science' },
  { name: 'Information Systems', code: 'IS', description: 'Department of Information Systems' },
  { name: 'Artificial Intelligence', code: 'AI', description: 'Department of Artificial Intelligence' },
  { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
];

const INSTRUCTORS = [
  { name: 'Dr. Ahmed Mohamed', email: 'ahmed.mohamed@nti.edu', phone: '0100 111 2233', specialization: 'Database Systems' },
  { name: 'Dr. Mohamed Ali', email: 'mohamed.ali@nti.edu', phone: '0100 222 3344', specialization: 'Web Development' },
  { name: 'Dr. Sara Hassan', email: 'sara.hassan@nti.edu', phone: '0100 333 4455', specialization: 'Artificial Intelligence' },
  { name: 'Dr. Khaled Omar', email: 'khaled.omar@nti.edu', phone: '0100 444 5566', specialization: 'Software Engineering' },
  { name: 'Dr. Laila Fathy', email: 'laila.fathy@nti.edu', phone: '0100 555 6677', specialization: 'Algorithms' },
  { name: 'Dr. Youssef Nabil', email: 'youssef.nabil@nti.edu', phone: '0100 666 7788', specialization: 'Networks' },
];


const COURSES = [
  { name: 'Database Systems', code: 'DB101', hours: 3, deptCode: 'CS', instructorEmail: 'ahmed.mohamed@nti.edu' },
  { name: 'Web Development', code: 'WEB101', hours: 3, deptCode: 'CS', instructorEmail: 'mohamed.ali@nti.edu' },
  { name: 'Data Structures', code: 'DS201', hours: 4, deptCode: 'CS', instructorEmail: 'laila.fathy@nti.edu' },
  { name: 'Software Engineering', code: 'SE301', hours: 3, deptCode: 'IS', instructorEmail: 'khaled.omar@nti.edu' },
  { name: 'Operating Systems', code: 'OS301', hours: 4, deptCode: 'IS', instructorEmail: 'khaled.omar@nti.edu' },
  { name: 'Artificial Intelligence', code: 'AI401', hours: 3, deptCode: 'AI', instructorEmail: 'sara.hassan@nti.edu' },
  { name: 'Computer Networks', code: 'NET201', hours: 3, deptCode: 'IT', instructorEmail: 'youssef.nabil@nti.edu' },
];

const STUDENTS = [
  { name: 'Ahmed Ali', email: 'ahmed.ali@student.nti.edu', phone: '0101 234 5678', age: 20, level: 2, deptCode: 'CS' },
  { name: 'Omar Samir', email: 'omar.samir@student.nti.edu', phone: '0101 234 5679', age: 21, level: 2, deptCode: 'CS' },
  { name: 'Ziad Tarek', email: 'ziad.tarek@student.nti.edu', phone: '0101 234 5680', age: 22, level: 3, deptCode: 'CS' },
  { name: 'Mohamed Hassan', email: 'mohamed.hassan@student.nti.edu', phone: '0101 234 5681', age: 22, level: 3, deptCode: 'IS' },
  { name: 'Youssef Ahmed', email: 'youssef.ahmed@student.nti.edu', phone: '0101 234 5682', age: 23, level: 4, deptCode: 'IS' },
  { name: 'Rana Sami', email: 'rana.sami@student.nti.edu', phone: '0101 234 5683', age: 19, level: 1, deptCode: 'IS' },
  { name: 'Mahmoud Ali', email: 'mahmoud.ali@student.nti.edu', phone: '0101 234 5684', age: 19, level: 1, deptCode: 'AI' },
  { name: 'Hana Mostafa', email: 'hana.mostafa@student.nti.edu', phone: '0101 234 5685', age: 20, level: 2, deptCode: 'AI' },
  { name: 'Karim Fathy', email: 'karim.fathy@student.nti.edu', phone: '0101 234 5686', age: 21, level: 3, deptCode: 'AI' },
  { name: 'Nour Ibrahim', email: 'nour.ibrahim@student.nti.edu', phone: '0101 234 5687', age: 19, level: 1, deptCode: 'IT' },
  { name: 'Salma Adel', email: 'salma.adel@student.nti.edu', phone: '0101 234 5688', age: 20, level: 2, deptCode: 'IT' },
];




const ENROLLMENTS = [
  { studentEmail: 'ahmed.ali@student.nti.edu', courseCode: 'DB101', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'ahmed.ali@student.nti.edu', courseCode: 'WEB101', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'ahmed.ali@student.nti.edu', courseCode: 'DS201', semester: 'Spring 2026', status: 'completed', grade: 88 },
  { studentEmail: 'omar.samir@student.nti.edu', courseCode: 'DS201', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'omar.samir@student.nti.edu', courseCode: 'SE301', semester: 'Fall 2025', status: 'dropped' },
  { studentEmail: 'ziad.tarek@student.nti.edu', courseCode: 'DB101', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'mohamed.hassan@student.nti.edu', courseCode: 'SE301', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'mohamed.hassan@student.nti.edu', courseCode: 'DB101', semester: 'Spring 2026', status: 'completed', grade: 85 },
  { studentEmail: 'youssef.ahmed@student.nti.edu', courseCode: 'OS301', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'youssef.ahmed@student.nti.edu', courseCode: 'WEB101', semester: 'Spring 2026', status: 'completed', grade: 78 },
  { studentEmail: 'rana.sami@student.nti.edu', courseCode: 'SE301', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'mahmoud.ali@student.nti.edu', courseCode: 'AI401', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'hana.mostafa@student.nti.edu', courseCode: 'AI401', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'karim.fathy@student.nti.edu', courseCode: 'AI401', semester: 'Spring 2026', status: 'completed', grade: 91 },
  { studentEmail: 'nour.ibrahim@student.nti.edu', courseCode: 'NET201', semester: 'Fall 2026', status: 'active' },
  { studentEmail: 'salma.adel@student.nti.edu', courseCode: 'NET201', semester: 'Fall 2026', status: 'active' },
];

async function upsertByField(Model, field, items) {
  const created = [];
  const skipped = [];
  for (const item of items) {
    const existing = await Model.findOne({ [field]: item[field] });
    if (existing) {
      skipped.push(existing);
      continue;
    }
    created.push(await Model.create(item));
  }
  return { all: [...skipped, ...created], createdCount: created.length, skippedCount: skipped.length };
}

async function run() {
  await connectDB();

  const deptResult = await upsertByField(Department, 'code', DEPARTMENTS);
  console.log(`Departments: ${deptResult.createdCount} created, ${deptResult.skippedCount} already existed`);
  const deptByCode = Object.fromEntries(deptResult.all.map((d) => [d.code, d]));

  const instResult = await upsertByField(Instructor, 'email', INSTRUCTORS);
  console.log(`Instructors: ${instResult.createdCount} created, ${instResult.skippedCount} already existed`);
  const instByEmail = Object.fromEntries(instResult.all.map((i) => [i.email, i]));

  const coursesToUpsert = COURSES.map((c) => ({
    name: c.name,
    code: c.code,
    hours: c.hours,
    departmentId: deptByCode[c.deptCode]._id,
    instructorId: instByEmail[c.instructorEmail]._id,
  }));
  const courseResult = await upsertByField(Course, 'code', coursesToUpsert);
  console.log(`Courses: ${courseResult.createdCount} created, ${courseResult.skippedCount} already existed`);
  const courseByCode = Object.fromEntries(courseResult.all.map((c) => [c.code, c]));

  const studentsToUpsert = STUDENTS.map((s) => ({
    name: s.name,
    email: s.email,
    phone: s.phone,
    age: s.age,
    level: s.level,
    departmentId: deptByCode[s.deptCode]._id,
  }));
  const studentResult = await upsertByField(Student, 'email', studentsToUpsert);
  console.log(`Students: ${studentResult.createdCount} created, ${studentResult.skippedCount} already existed`);
  const studentByEmail = Object.fromEntries(studentResult.all.map((s) => [s.email, s]));

  let enrollCreated = 0;
  let enrollSkipped = 0;
  for (const e of ENROLLMENTS) {
    const studentId = studentByEmail[e.studentEmail]._id;
    const courseId = courseByCode[e.courseCode]._id;
    const existing = await Enrollment.findOne({ studentId, courseId, semester: e.semester });
    if (existing) {
      enrollSkipped++;
      continue;
    }
    await Enrollment.create({ studentId, courseId, semester: e.semester, status: e.status, grade: e.grade });
    enrollCreated++;
  }
  console.log(`Enrollments: ${enrollCreated} created, ${enrollSkipped} already existed`);

  console.log('\nDone. Totals in the database now:');
  for (const [label, Model] of [
    ['Departments', Department],
    ['Instructors', Instructor],
    ['Courses', Course],
    ['Students', Student],
    ['Enrollments', Enrollment],
  ]) {
    console.log(`  ${label}: ${await Model.countDocuments()}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
