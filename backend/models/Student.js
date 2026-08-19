const mongoose = require('mongoose');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return emailRegex.test(value);
        },
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [16, 'Age must be at least 16'],
      max: [60, 'Age must not exceed 60'],
    },
    level: {
      type: Number,
      min: [1, 'Level must be at least 1'],
      max: [4, 'Level must not exceed 4'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
