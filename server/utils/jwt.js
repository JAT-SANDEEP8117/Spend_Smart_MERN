const jwt = require("jsonwebtoken");

// Tokens expire after 24 hours (absolute maximum session lifetime).
// This is enforced on the backend — frontend also enforces via AuthContext.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "spend_smart_super_secret_jwt_key_2026_xyz",
    { expiresIn: "24h" }
  );
};

module.exports = { generateToken };
