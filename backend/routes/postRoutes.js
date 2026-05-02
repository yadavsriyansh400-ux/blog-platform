import express from "express";
import {
  createPost,
  getPosts,
  getPostsByUser,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createPost);

// GET ALL
router.get("/", getPosts);

// GET BY USER
router.get("/user/:userId", getPostsByUser);

// UPDATE
router.put("/:id", protect, updatePost);

// DELETE
router.delete("/:id", protect, deletePost);

export default router; // ✅ VERY IMPORTANT