import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ add comment
router.post("/:postId", protect, addComment);

// 📥 get comments of a post
router.get("/:postId", getComments);

// ❌ delete comment
router.delete("/:id", protect, deleteComment);

export default router;