// NOTE: Minimal starter model based on the documented spec (name, email, phone, specialization).
// Owned by Mirola (Instructors module) — extend/adjust as needed.
// Created so Course.populate('instructorId') doesn't crash with MissingSchemaError
// before the real Instructors module exists.
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
