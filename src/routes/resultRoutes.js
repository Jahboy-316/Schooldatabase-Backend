const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createResult, getAllResults, getResultById, updateResult, deleteResult } = require("../controllers/result/resultController");

const router = express.Router();

router.post("/", authenticate, authorize("admin", "teacher"), createResult);
router.get("/", authenticate, authorize("admin", "teacher", "student"), getAllResults);
router.get("/:id", authenticate, authorize("admin", "teacher", "student"), getResultById);
router.put("/:id", authenticate, authorize("admin", "teacher"), updateResult);
router.delete("/:id", authenticate, authorize("admin"), deleteResult);

module.exports = router;
