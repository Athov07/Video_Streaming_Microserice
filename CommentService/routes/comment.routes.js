import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
  editComment,
  toggleLikeComment
} from "../controllers/comment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);

router.get("/:videoId", getComments);

router.delete("/:id", authMiddleware, deleteComment);

router.put("/:id", authMiddleware, editComment);

router.put("/:id/like", authMiddleware, toggleLikeComment);

export default router;