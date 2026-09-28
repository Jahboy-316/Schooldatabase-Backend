const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require("../controllers/class/classController");

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createClass);
router.get("/", authenticate, authorize("admin", "teacher", "student"), getAllClasses);
router.get("/:id", authenticate, authorize("admin", "teacher", "student"), getClassById);
router.put("/:id", authenticate, authorize("admin"), updateClass);
router.delete("/:id", authenticate, authorize("admin"), deleteClass);

module.exports = router;
