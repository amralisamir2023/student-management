const validateEnrollment = (req, res, next) => {
    const {
        studentId,
        courseId,
        semester,
        status,
    } = req.body;

    if (!studentId) {
        return res.status(400).json({
            message: "studentId is required",
        });
    }

    if (!courseId) {
        return res.status(400).json({
            message: "courseId is required",
        });
    }

    if (!semester) {
        return res.status(400).json({
            message: "semester is required",
        });
    }

    if (!status) {
        return res.status(400).json({
            message: "status is required",
        });
    }

    next();
};

module.exports = {
    validateEnrollment,
};