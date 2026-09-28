const { students } = require("../../data/students");

const getMyProfile = (req, res, next) => {
  try {
    const student = students.find((s) => s.userId === req.user.id || s.email === req.user.email);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. An admin needs to create your student record."
      });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      student
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile };
