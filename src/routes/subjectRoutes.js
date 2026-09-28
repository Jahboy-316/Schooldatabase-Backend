const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject } = require("../controllers/subject/subjectController");

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createSubject);
router.get("/", authenticate, authorize("admin", "teacher", "student"), getAllSubjects);
router.get("/:id", authenticate, authorize("admin", "teacher", "student"), getSubjectById);
router.put("/:id", authenticate, authorize("admin"), updateSubject);
router.delete("/:id", authenticate, authorize("admin"), deleteSubject);

module.exports = router;
