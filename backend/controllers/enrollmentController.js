const Enrollment = require('../models/Enrollment');

// @desc    Get all enrollments (with search and filter by semester)
// @route   GET /api/enrollments
const getEnrollments = async (req, res) => {
  try {
    const { semester, search } = req.query;
    const filter = {};

    if (semester) {
      filter.semester = semester;
    }

    let enrollments = await Enrollment.find(filter).populate('studentId').populate('courseId');

    // Search by student name, course name, or course code
    if (search) {
      const searchText = search.toLowerCase();

      enrollments = enrollments.filter((enrollment) => {
        const studentName = enrollment.studentId?.name?.toLowerCase() || '';
        const courseName = enrollment.courseId?.name?.toLowerCase() || '';
        const courseCode = enrollment.courseId?.code?.toLowerCase() || '';

        return (
          studentName.includes(searchText) || courseName.includes(searchText) || courseCode.includes(searchText)
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrollments fetched successfully',
      data: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching enrollments',
      data: null,
    });
  }
};

// @desc    Get a single enrollment by ID
// @route   GET /api/enrollments/:id
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('studentId').populate('courseId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrollment fetched successfully',
      data: enrollment,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the enrollment',
      data: null,
    });
  }
};

// @desc    Get all courses a specific student is enrolled in
// @route   GET /api/enrollments/student/:studentId
const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.studentId })
      .populate('studentId')
      .populate('courseId');

    return res.status(200).json({
      success: true,
      message: 'Student enrollments fetched successfully',
      data: enrollments,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching student enrollments',
      data: null,
    });
  }
};

// @desc    Get all students enrolled in a specific course
// @route   GET /api/enrollments/course/:courseId
const getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate('studentId')
      .populate('courseId');

    return res.status(200).json({
      success: true,
      message: 'Course enrollments fetched successfully',
      data: enrollments,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching course enrollments',
      data: null,
    });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course for this semester',
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
      message: 'Server error while creating the enrollment',
      data: null,
    });
  }
};

// @desc    Update an enrollment (e.g. grade or status)
// @route   PUT /api/enrollments/:id
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment id',
        data: null,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course for this semester',
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
      message: 'Server error while updating the enrollment',
      data: null,
    });
  }
};

// @desc    Remove a student from a course
// @route   DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
      data: null,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment id',
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting the enrollment',
      data: null,
    });
  }
};

module.exports = {
  getEnrollments,
  getEnrollmentById,
  getStudentCourses,
  getCourseStudents,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
