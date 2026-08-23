const express = require('express');
const router = express.Router();

const {
  getEnrollments,
  getEnrollmentById,
  getStudentCourses,
  getCourseStudents,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// NOTE: these two must stay above '/:id', otherwise Express would match
// '/student/xyz' and '/course/xyz' as if 'student'/'course' were the :id.
router.get('/student/:studentId', getStudentCourses);
router.get('/course/:courseId', getCourseStudents);

router.get('/', getEnrollments);
router.get('/:id', getEnrollmentById);
router.post('/', protect, authorize('admin'), createEnrollment);
router.put('/:id', protect, authorize('admin'), updateEnrollment);
router.delete('/:id', protect, authorize('admin'), deleteEnrollment);

module.exports = router;
