import Comment from "../models/comment.model.js";
import { getUserProfile } from "../services/profile.service.js";


/* =========================
   Add Comment
========================= */

export const addComment = async (req, res) => {
  try {

    const { videoId, text } = req.body;

    if (!videoId || !text) {
      return res.status(400).json({
        message: "videoId and text are required"
      });
    }

    const userId = req.user.id;
    const userName = req.user.name;

    // Fetch profile from ProfileService
    const profile = await getUserProfile(
  req.user.id,
  req.headers.authorization
);

    const profileImage = profile?.profilePicture || "";

    const comment = await Comment.create({
      videoId,
      userId,
      userName,
      profileImage,
      text,
    });

    res.status(201).json(comment);

  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};


/* =========================
   Get Comments
========================= */

export const getComments = async (req, res) => {
  try {

    const comments = await Comment.find({
      videoId: req.params.videoId,
    }).sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


/* =========================
   Delete Comment
========================= */

export const deleteComment = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner can delete
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted" });

  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};


/* =========================
   Edit Comment
========================= */

export const editComment = async (req, res) => {
  try {

    const { text } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner can edit
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = text;

    await comment.save();

    res.json(comment);

  } catch (error) {
    console.error("Edit Comment Error:", error);
    res.status(500).json({ message: "Failed to edit comment" });
  }
};


/* =========================
   Toggle Like Comment
========================= */

export const toggleLikeComment = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json(comment);

  } catch (error) {
    console.error("Like Comment Error:", error);
    res.status(500).json({ message: "Failed to like comment" });
  }
};