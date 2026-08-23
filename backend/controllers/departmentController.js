const Department = require('../models/Department');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Get all departments (with search by name)
// @route   GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const { name } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const departments = await Department.find(filter);

    return res.status(200).json({
      success: true,
      message: 'Departments fetched successfully',
      data: departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching departments',
      data: null,
    });
  }
};

// @desc    Get a single department by ID
// @route   GET /api/departments/:id
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department fetched successfully',
      data: department,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the department',
      data: null,
    });
  }
};

// @desc    Get all students that belong to a department
// @route   GET /api/departments/:id/students
const getDepartmentStudents = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null,
      });
    }

    const students = await Student.find({ departmentId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Department students fetched successfully',
      data: students,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching department students',
      data: null,
    });
  }
};

// @desc    Get all courses that belong to a department
// @route   GET /api/departments/:id/courses
const getDepartmentCourses = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null,
      });
    }

    const courses = await Course.find({ departmentId: req.params.id }).populate('instructorId');

    return res.status(200).json({
      success: true,
      message: 'Department courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching department courses',
      data: null,
    });
  }
};

// @desc    Create a new department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A department with this code already exists',
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
      message: 'Server error while creating the department',
      data: null,
    });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A department with this code already exists',
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
      message: 'Server error while updating the department',
      data: null,
    });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
      data: null,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting the department',
      data: null,
    });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  getDepartmentStudents,
  getDepartmentCourses,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
