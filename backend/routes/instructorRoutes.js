const express = require('express');
const router = express.Router();
const {
    getInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
} = require('../controllers/instructorController');

router.route('/')
    .get(getInstructors)
    .post(createInstructor);

router.route('/:id')
    .get(getInstructorById)
    .put(updateInstructor)
    .delete(deleteInstructor);

module.exports = router;