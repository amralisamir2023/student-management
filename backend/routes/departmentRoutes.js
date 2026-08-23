const express = require('express');
const router = express.Router();

const {
  getDepartments,
  getDepartmentById,
  getDepartmentStudents,
  getDepartmentCourses,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.get('/:id/students', getDepartmentStudents);
router.get('/:id/courses', getDepartmentCourses);
router.post('/', protect, authorize('admin'), createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
