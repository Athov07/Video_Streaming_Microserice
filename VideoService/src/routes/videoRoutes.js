import express from "express";
import multer from "multer";
import {
  uploadVideo,
  getMyStats,
  getVideoById,
  getAllVideos,
  likeVideo,
  dislikeVideo,
  editVideo,
  deleteVideo,
  getMyVideos,
  
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("video"), uploadVideo);
router.get("/", getAllVideos);
router.get("/my-stats", protect, getMyStats);
router.get("/my-videos", protect, getMyVideos);
router.put("/like/:id", protect, likeVideo);
router.put("/dislike/:id", protect, dislikeVideo);
router.put("/edit/:id", protect, editVideo);
router.delete("/delete/:id", protect, deleteVideo);
router.get("/:id", getVideoById);
export default router;
