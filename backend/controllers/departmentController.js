// NOTE: Minimal starter controller (basic CRUD) so the module is integrated and testable.
// Owned by Amr Tarek (Departments module) — extend with search / show-students / show-courses etc.
const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();

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
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the department',
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
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
