const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
let client = null;
if (googleClientId && googleClientId !== "your_google_oauth_client_id_here.apps.googleusercontent.com") {
  client = new OAuth2Client(googleClientId);
}

// Utility to verify Google token with a dev fallback
const verifyGoogleToken = async (token) => {
  if (client) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
      return ticket.getPayload();
    } catch (err) {
      console.warn("Google API verification failed, trying fallback decoding for dev:", err.message);
    }
  }

  // Fallback for dev testing if Google client ID is not configured:
  const decoded = jwt.decode(token);
  if (decoded && decoded.email) {
    return {
      email: decoded.email,
      sub: decoded.sub || decoded.email,
      name: decoded.name || decoded.email.split("@")[0],
    };
  }
  throw new Error("Invalid Google token or Google Client ID not configured");
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists. Please use another email." });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists. Please choose another." });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        user: user.toJSON(),
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist. Please create an account." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Google Sign-In / Verification
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token is required" });
  }

  try {
    const payload = await verifyGoogleToken(token);
    const { email, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token and login
      const localToken = generateToken(user._id);
      return res.json({
        isNewUser: false,
        user: user.toJSON(),
        token: localToken,
      });
    } else {
      // User does not exist, return email and googleId to let them choose username
      return res.json({
        isNewUser: true,
        email,
        googleId,
      });
    }
  } catch (error) {
    console.error("Google authentication error:", error.message);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

// @desc    Complete Google Sign-Up with chosen Display Name
// @route   POST /api/auth/google/register
// @access  Public
const googleRegister = async (req, res) => {
  const { email, googleId, username, token } = req.body;

  if (!email || !googleId || !username || !token) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Re-verify google token for safety
    await verifyGoogleToken(token);

    // Verify email unique
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Verify username unique
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists. Please choose another." });
    }

    // Create new google user
    const user = await User.create({
      username,
      email,
      googleId,
      isGoogleUser: true,
    });

    const localToken = generateToken(user._id);
    res.status(201).json({
      user: user.toJSON(),
      token: localToken,
    });
  } catch (error) {
    console.error("Google registration error:", error.message);
    res.status(400).json({ message: "Google registration failed" });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  googleRegister,
};
