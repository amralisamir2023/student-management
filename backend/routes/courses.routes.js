const express = require("express");

const CoursesRouter = express.Router();

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courses");

CoursesRouter.get("/", getAllCourses);

CoursesRouter.get("/:id", getCourseById);

CoursesRouter.post("/", createCourse);

CoursesRouter.put("/:id", updateCourse);

CoursesRouter.delete("/:id", deleteCourse);

module.exports = { CoursesRouter };