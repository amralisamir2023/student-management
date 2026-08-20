const express = require("express");

const EnrollmentRouter = express.Router();

const {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getStudentCourses,
    getCourseStudents,
} = require("../controllers/enrollmentController");

const {
    validateEnrollment,
} = require("../validators/enrollment.validator");


// Get all enrollments
EnrollmentRouter.get("/", getAllEnrollments);


// Get all courses for a specific student
EnrollmentRouter.get(
    "/student/:studentId",
    getStudentCourses
);


// Get all students for a specific course
EnrollmentRouter.get(
    "/course/:courseId",
    getCourseStudents
);


// Get enrollment by ID
EnrollmentRouter.get(
    "/:id",
    getEnrollmentById
);


// Create enrollment
EnrollmentRouter.post(
    "/",
    validateEnrollment,
    createEnrollment
);


// Update enrollment
EnrollmentRouter.put(
    "/:id",
    validateEnrollment,
    updateEnrollment
);


// Delete enrollment
EnrollmentRouter.delete(
    "/:id",
    deleteEnrollment
);


module.exports = {
    EnrollmentRouter,
};