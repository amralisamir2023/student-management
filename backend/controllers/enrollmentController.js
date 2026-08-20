const { Enrollment } = require("../models/Enrollment");

// Get all enrollments
// Supports:
// GET /api/enrollments
// GET /api/enrollments?semester=Fall
// GET /api/enrollments?search=Radwa
const getAllEnrollments = (req, res, next) => {
    const { semester, search } = req.query;

    const filter = {};

    // Filter by semester
    if (semester) {
        filter.semester = semester;
    }

    Enrollment.find(filter)
        .populate("studentId")
        .populate("courseId")
        .then((enrollments) => {
            let result = enrollments;

            // Search by student name,
            // course name, or course code
            if (search) {
                const searchText = search.toLowerCase();

                result = enrollments.filter((enrollment) => {
                    const studentName =
                        enrollment.studentId?.name?.toLowerCase() || "";

                    const courseName =
                        enrollment.courseId?.name?.toLowerCase() || "";

                    const courseCode =
                        enrollment.courseId?.code?.toLowerCase() || "";

                    return (
                        studentName.includes(searchText) ||
                        courseName.includes(searchText) ||
                        courseCode.includes(searchText)
                    );
                });
            }

            res.status(200).json(result);
        })
        .catch((error) => {
            next(error);
        });
};


// Get enrollment by ID
const getEnrollmentById = (req, res, next) => {
    Enrollment.findById(req.params.id)
        .populate("studentId")
        .populate("courseId")
        .then((enrollment) => {
            if (!enrollment) {
                return res.status(404).json({
                    message: "Enrollment not found",
                });
            }

            res.status(200).json(enrollment);
        })
        .catch((error) => {
            next(error);
        });
};


// Create enrollment
const createEnrollment = async (req, res, next) => {
    try {
        const {
            studentId,
            courseId,
            semester,
            grade,
            status,
        } = req.body;

        // Check if the student is already enrolled
        // in the same course in the same semester
        const existingEnrollment = await Enrollment.findOne({
            studentId,
            courseId,
            semester,
        });

        if (existingEnrollment) {
            return res.status(409).json({
                message:
                    "Student is already enrolled in this course for this semester",
            });
        }

        const enrollment = await Enrollment.create({
            studentId,
            courseId,
            semester,
            grade,
            status,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        next(error);
    }
};


// Update enrollment
const updateEnrollment = (req, res, next) => {
    const {
        studentId,
        courseId,
        semester,
        grade,
        status,
    } = req.body;

    Enrollment.findByIdAndUpdate(
        req.params.id,
        {
            studentId,
            courseId,
            semester,
            grade,
            status,
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((enrollment) => {
            if (!enrollment) {
                return res.status(404).json({
                    message: "Enrollment not found",
                });
            }

            res.status(200).json(enrollment);
        })
        .catch((error) => {
            next(error);
        });
};


// Delete enrollment
const deleteEnrollment = (req, res, next) => {
    Enrollment.findByIdAndDelete(req.params.id)
        .then((enrollment) => {
            if (!enrollment) {
                return res.status(404).json({
                    message: "Enrollment not found",
                });
            }

            res.status(200).json({
                message: "Enrollment deleted successfully",
            });
        })
        .catch((error) => {
            next(error);
        });
};


// Get all courses for a specific student
const getStudentCourses = (req, res, next) => {
    Enrollment.find({
        studentId: req.params.studentId,
    })
        .populate("studentId")
        .populate("courseId")
        .then((enrollments) => {
            res.status(200).json(enrollments);
        })
        .catch((error) => {
            next(error);
        });
};


// Get all students for a specific course
const getCourseStudents = (req, res, next) => {
    Enrollment.find({
        courseId: req.params.courseId,
    })
        .populate("studentId")
        .populate("courseId")
        .then((enrollments) => {
            res.status(200).json(enrollments);
        })
        .catch((error) => {
            next(error);
        });
};


module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getStudentCourses,
    getCourseStudents,
};