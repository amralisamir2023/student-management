require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const { connectDB } = require("./config/db.config.js");

connectDB();


const { CoursesRouter } = require("./routes/courses.routes.js");
app.use("/api/courses", CoursesRouter);

const { DepartmentRouter } = require("./routes/departments.js");
app.use("/api/departments", DepartmentRouter);
const { ErrorHandle } = require("./midleWare/ErrorHandling.js");
app.use(ErrorHandle);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});