const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "name",
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: false,
    },
});

const Courses = mongoose.model("Courses", CoursesSchema);
module.exports = { Courses };