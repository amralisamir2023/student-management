const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true,
    },
    grade: {
      type: Number,
      min: [0, 'Grade must be at least 0'],
      max: [100, 'Grade must not exceed 100'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from enrolling twice in the same course in the same semester
enrollmentSchema.index({ studentId: 1, courseId: 1, semester: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
