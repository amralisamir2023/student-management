const Instructor = require('../models/Instructor');
const Course = require('../models/Course');

// @desc    Get all instructors (with search and filter by specialization)
// @route   GET /api/instructors
const getInstructors = async (req, res) => {
  try {
    const { name, specialization } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    const instructors = await Instructor.find(filter);

    return res.status(200).json({
      success: true,
      message: 'Instructors fetched successfully',
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching instructors',
      data: null,
    });
  }
};

// @desc    Get a single instructor by ID
// @route   GET /api/instructors/:id
const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Instructor fetched successfully',
      data: instructor,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the instructor',
      data: null,
    });
  }
};

// @desc    Get all courses taught by an instructor
// @route   GET /api/instructors/:id/courses
const getInstructorCourses = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
        data: null,
      });
    }

    const courses = await Course.find({ instructorId: req.params.id }).populate('departmentId');

    return res.status(200).json({
      success: true,
      message: 'Instructor courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching instructor courses',
      data: null,
    });
  }
};

// @desc    Create a new instructor
// @route   POST /api/instructors
const createInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Instructor created successfully',
      data: instructor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An instructor with this email already exists',
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
      message: 'Server error while creating the instructor',
      data: null,
    });
  }
};

// @desc    Update an instructor
// @route   PUT /api/instructors/:id
const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Instructor updated successfully',
      data: instructor,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor id',
        data: null,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An instructor with this email already exists',
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
      message: 'Server error while updating the instructor',
      data: null,
    });
  }
};

// @desc    Delete an instructor
// @route   DELETE /api/instructors/:id
const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Instructor deleted successfully',
      data: null,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting the instructor',
      data: null,
    });
  }
};

module.exports = {
  getInstructors,
  getInstructorById,
  getInstructorCourses,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};
