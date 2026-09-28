const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require("../controllers/student/studentController");
const { getMyProfile } = require("../controllers/student/studentProfileController");

const router = express.Router();

router.get("/profile", authenticate, authorize("student"), getMyProfile);

router.post("/", authenticate, authorize("admin"), createStudent);
router.get("/", authenticate, authorize("admin", "teacher"), getAllStudents);
router.get("/:id", authenticate, authorize("admin", "teacher"), getStudentById);
router.put("/:id", authenticate, authorize("admin"), updateStudent);
router.delete("/:id", authenticate, authorize("admin"), deleteStudent);

module.exports = router;
