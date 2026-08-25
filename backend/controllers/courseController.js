const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');



const getCourses = async (req, res) => {
  try {
    const { name, departmentId, instructorId } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (departmentId) {
      filter.departmentId = departmentId;
    }

    if (instructorId) {
      filter.instructorId = instructorId;
    }

    const courses = await Course.find(filter).populate('departmentId').populate('instructorId');

    return res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      data: null,
    });
  }
};



const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('departmentId').populate('instructorId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Course fetched successfully',
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the course',
      data: null,
    });
  }
};



const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A course with this code already exists',
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
      message: 'Server error while creating the course',
      data: null,
    });
  }
};



const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A course with this code already exists',
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
      message: 'Server error while updating the course',
      data: null,
    });
  }
};



const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        data: null,
      });
    }

    
    
    await Enrollment.deleteMany({ courseId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting the course',
      data: null,
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
