const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
        },

        semester: {
            type: String,
            required: true,
        },

        grade: {
            type: Number,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: ["active", "completed", "dropped"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate enrollment for the same student,
// course, and semester
EnrollmentSchema.index(
    {
        studentId: 1,
        courseId: 1,
        semester: 1,
    },
    {
        unique: true,
    }
);

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

module.exports = { Enrollment };