const express = require('express');
const router = express.Router();

const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { departmentAdmin } = require('../middleware/departmentMiddleware');

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.post('/', departmentAdmin, createDepartment);
router.put('/:id', departmentAdmin, updateDepartment);
router.delete('/:id', departmentAdmin, deleteDepartment);

module.exports = router;
