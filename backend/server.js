const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const { CoursesRouter } = require("./routes/courses.routes");
const { EnrollmentRouter } = require("./routes/enrollmentRoutes");

// Error Middleware
const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

// Create Express App
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", CoursesRouter);
app.use("/api/enrollments", EnrollmentRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});