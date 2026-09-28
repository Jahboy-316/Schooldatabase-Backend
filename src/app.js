require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const authRoutes = require("./routes/authenticationRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resultRoutes = require("./routes/resultRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/results", resultRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

app.use(errorHandler);

module.exports = app;
