const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require("../controllers/teacher/teacherController");

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createTeacher);
router.get("/", authenticate, authorize("admin", "teacher"), getAllTeachers);
router.get("/:id", authenticate, authorize("admin", "teacher"), getTeacherById);
router.put("/:id", authenticate, authorize("admin"), updateTeacher);
router.delete("/:id", authenticate, authorize("admin"), deleteTeacher);

module.exports = router;
