import express from "express";
import {
  updateProfile,
  getUserProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// update own profile
router.put("/profile", protect, updateProfile);

// get profile by id
router.get("/:id", getUserProfile);

export default router;