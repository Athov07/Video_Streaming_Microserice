import Comment from "../models/comment.model.js";

export const addComment = async (req, res) => {
  try {

    const { videoId, text } = req.body;

    if (!videoId || !text) {
      return res.status(400).json({
        message: "videoId and text are required"
      });
    }

    const comment = await Comment.create({
      videoId,
      userId: req.user.id,
      userName: req.user.name,
      text,
    });

    res.status(201).json(comment);

  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};



export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      videoId: req.params.videoId,
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};


export const editComment = async (req, res) => {
  try {

    const { text } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner can edit
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


export const toggleLikeComment = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      // remove like
      comment.likes = comment.likes.filter(id => id !== userId);
    } else {
      // add like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json(comment);

  } catch (error) {
    console.error("Like Comment Error:", error);
    res.status(500).json({ message: "Failed to like comment" });
  }
};