import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";


/* =========================
   Upload Video
========================= */
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
      eager: [{ width: 300, height: 200, crop: "fill", format: "jpg" }],
    });

    const thumbnailUrl =
      result.eager && result.eager[0] ? result.eager[0].secure_url : "";

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description || "",
      url: result.secure_url,
      thumbnailUrl,
      category: req.body.category || "public",
      userId: req.user.id,
      userName: req.user.name,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Video upload failed" });
  }
};

/* =========================
   Get Single Video
========================= */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error("Get Video Error:", error);
    res.status(500).json({ message: "Cannot fetch video" });
  }
};

/* =========================
   Get All Videos
========================= */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Cannot fetch videos" });
  }
};

/* =========================
   Get My Videos
========================= */
export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(videos);
  } catch (error) {
    console.error("My Videos Error:", error);
    res.status(500).json({ message: "Cannot fetch my videos" });
  }
};

/* =========================
   Like Video (Atomic Update)
========================= */
export const likeVideo = async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user.id },
        $pull: { dislikes: req.user.id },
      },
      { returnDocument: "after" }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updatedVideo);
  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({ message: "Error liking video" });
  }
};

/* =========================
   Dislike Video (Atomic Update)
========================= */
export const dislikeVideo = async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { dislikes: req.user.id },
        $pull: { likes: req.user.id },
      },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updatedVideo);
  } catch (error) {
    console.error("Dislike Error:", error);
    res.status(500).json({ message: "Error disliking video" });
  }
};

/* =========================
   Edit Video
========================= */
export const editVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to edit this video",
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    console.error("Edit Error:", error);
    res.status(500).json({ message: "Error editing video" });
  }
};

/* =========================
   Delete Video
========================= */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};