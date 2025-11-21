// backend/routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const config = require("../utils/config");

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, config.JWT_SECRET, {
    expiresIn: "2h",
  });
};

router.post("/register", async (request, response, next) => {
  try {
    const { fullName, email, password } = request.body;

    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return response.status(400).send({ error: "User already exist" });
    }

    const newUser = new User({ fullName, email, password });

    await newUser.save();

    const token = generateToken(newUser.id, newUser.email);

    response.status(201).json({
      message: "user created successfully",
      token: token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;

    const loginUser = await User.findOne({ email: email });

    if (!loginUser) {
      return response
        .status(400)
        .send({ error: "Invalid credentials from email check" });
    }

    const isPasswordValid = await bcrypt.compare(password, loginUser.password);

    if (!isPasswordValid) {
      return response
        .status(400)
        .json({ error: "Invalid credentials from password check" });
    }

    const token = generateToken(loginUser.id, loginUser.email);
    response.json({
      message: "Login Successful",
      token: token,
      user: {
        id: loginUser.id,
        fullName: loginUser.fullName,
        email: loginUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/validate-token", async (request, response, next) => {
  try {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return response.status(401).json({ error: "No token provided" });
    }

    // Verify token (promise-based)
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Find user in DB
    const verifyUser = await User.findOne({ email: decoded.email });
    if (!verifyUser) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(verifyUser.id,"this is id check in backinde of user");
    // Send back safe info
    return response.json({
      success: true,
      valid: true,
      fullName: verifyUser.fullName,
      email: verifyUser.email,
      id: verifyUser.id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
