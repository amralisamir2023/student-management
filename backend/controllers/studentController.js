const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

// @desc    Get all students (with search, filtering and populate)
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const { name, departmentId, level } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (departmentId) {
      filter.departmentId = departmentId;
    }

    if (level) {
      filter.level = level;
    }

    const students = await Student.find(filter).populate('departmentId');

    return res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      data: null,
    });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('departmentId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student fetched successfully',
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the student',
      data: null,
    });
  }
};

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email already exists',
        data: null,
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating the student',
      data: null,
    });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email already exists',
        data: null,
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating the student',
      data: null,
    });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        data: null,
      });
    }

    // Without this, any enrollment that pointed at this student would be
    // left dangling — populate('studentId') would return null for it
    // forever, showing up as a blank/"—" student in every enrollment list.
    await Enrollment.deleteMany({ studentId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting the student',
      data: null,
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
