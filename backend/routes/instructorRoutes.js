const express = require('express');
const router = express.Router();

const {
  getInstructors,
  getInstructorById,
  getInstructorCourses,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getInstructors);
router.get('/:id', getInstructorById);
router.get('/:id/courses', getInstructorCourses);
router.post('/', protect, authorize('admin'), createInstructor);
router.put('/:id', protect, authorize('admin'), updateInstructor);
router.delete('/:id', protect, authorize('admin'), deleteInstructor);

module.exports = router;
