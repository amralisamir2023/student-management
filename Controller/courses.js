const {Courses} = require("../models/courser.model");

const getAllCourses = (req, res, next) => {
    Courses.find()
        .populate("departmentId")
        .populate("instructorId")
        .then((courses) => {
            res.status(200).json(courses);
        })
        .catch((error) => {
            next(error);
        });
};

const getCourseById = (req, res, next) => {
    Courses.findById(req.params.id)
        .populate("departmentId")
        .populate("instructorId")
        .then((course) => {
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(course);
        })
        .catch((error) => {
            next(error);
        });
};

const createCourse = (req, res, next) => {
    const { name, code, hours, departmentId, instructorId } = req.body;

    Courses.create({ name, code, hours, departmentId, instructorId })
        .then((course) => {
            res.status(201).json(course);
        })
        .catch((error) => {
            next(error);
        });
};

const updateCourse = (req, res, next) => {
    const { name, code, hours, departmentId, instructorId } = req.body;

    Courses.findByIdAndUpdate(
        req.params.id,
        { name, code, hours, departmentId, instructorId },
        { new: true, runValidators: true }
    )
        .then((course) => {
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(course);
        })
        .catch((error) => {
            next(error);
        });
};

const deleteCourse = (req, res, next) => {
    Courses.findByIdAndDelete(req.params.id)
        .then((course) => {
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json({ message: "Course deleted successfully" });
        })
        .catch((error) => {
            next(error);
        });
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };