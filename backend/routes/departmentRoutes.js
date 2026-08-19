// NOTE: Minimal starter routes so the module is integrated and testable.
// Owned by Amr Tarek (Departments module) — extend as needed.
const express = require('express');
const router = express.Router();

const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
