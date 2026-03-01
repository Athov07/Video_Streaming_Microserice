import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";

// Upload Video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file provided" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      url: result.secure_url,
      uploadedBy: req.user.id, // taken from JWT
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Video upload failed" });
  }
};

// Get All Videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    // console.log("Videos fetched:", videos);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json({ message: "Cannot fetch videos" });
  }
};

// Like Video
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (!video.likes.includes(req.user.id)) {
      video.likes.push(req.user.id);
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== req.user.id,
      );
    } else {
      video.likes = video.likes.filter((id) => id.toString() !== req.user.id);
    }

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Error liking video" });
  }
};


// Dislike Video
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Toggle dislike
    if (!video.dislikes.includes(req.user.id)) {
      video.dislikes.push(req.user.id);
      // Remove from likes if exists
      video.likes = video.likes.filter(id => id.toString() !== req.user.id);
    } else {
      video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.id);
    }

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Error disliking video" });
  }
};


// Edit Video (title, description)
export const editVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only uploader can edit
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this video" });
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Error editing video" });
  }
};


// Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only uploader can delete
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    // Optional: Delete from Cloudinary
    // Extract public_id from URL if stored
    const publicId = video.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`videos/${publicId}`, { resource_type: "video" });

    // Delete from DB
    await video.deleteOne(); // <-- updated method

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete Video Error:", error);
    res.status(500).json({ message: "Error deleting video" });
  }
};