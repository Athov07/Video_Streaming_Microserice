import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  getOrCreateProfile,
  updateProfile,
  followUser,
  getProfileByUserId
} from "../controllers/profileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", protect, getOrCreateProfile, (req, res) => {
  res.json(req.profile);
});

router.put("/", protect, upload.single("profilePicture"), updateProfile);
router.post("/follow/:userId", protect, followUser);
router.get("/user/:userId", protect, getProfileByUserId);

export default router;