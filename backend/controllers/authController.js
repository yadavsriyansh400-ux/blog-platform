import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


// 🔹 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// 🔹 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    // create verification link
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    // send email
    const emailSent = await sendEmail(
      email,
      "Verify Your Email",
      `
      <h2>Welcome to Blog Platform 🚀</h2>
      <p>Please click the button below to verify your email:</p>
      <a href="${verificationLink}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
        Verify Email
      </a>
      <p>If you didn’t create this account, ignore this email.</p>
      `
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "User created but email failed to send",
      });
    }

    res.status(201).json({
      message: "User registered. Please check your email to verify.",
    });

  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🔹 LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🚨 IMPORTANT CHECK
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🔹 VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.send("✅ Email verified successfully. You can now login.");

  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).send(error.message);
  }
};