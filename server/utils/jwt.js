const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "spend_smart_super_secret_jwt_key_2026_xyz",
    { expiresIn: "30d" }
  );
};

module.exports = { generateToken };
