const Instructor = require('../models/Instructor');

// Get all instructors
const getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find({});
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single instructor by ID
const getInstructorById = async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json(instructor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new instructor
const createInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.create(req.body);
        res.status(201).json(instructor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update instructor
const updateInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json(instructor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete instructor
const deleteInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findByIdAndDelete(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ message: 'Instructor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
};