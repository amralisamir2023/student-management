const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema(
    {},
    {
        strict: false,
    }
);

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = { Instructor };