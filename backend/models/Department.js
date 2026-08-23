const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      trim: true,
      unique: true,
      uppercase: true,
      minlength: [2, 'Department code must be at least 2 characters'],
      maxlength: [4, 'Department code must be at most 4 characters'],
      match: [/^[A-Z]{2,4}$/, 'Department code must contain 2 to 4 uppercase letters'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
