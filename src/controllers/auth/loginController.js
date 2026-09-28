const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../../data/users");
const { validateLogin } = require("../../validators/authValidator");

const login = async (req, res, next) => {
  try {
    const error = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
