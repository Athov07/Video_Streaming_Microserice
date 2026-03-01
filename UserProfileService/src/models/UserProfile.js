import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    socialLinks: {
      website: {
        type: String,
        default: "",
      },
      twitter: { type: String, default: "" },
      linkedin: {
        type: String,
        default: "",
      },
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
      },
    ],
    watchHistory: [
      {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    stats: {
      totalVideos: {
        type: Number,
        default: 0,
      },
      totalLikes: {
        type: Number,
        default: 0,
      },
      totalViews: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("UserProfile", userProfileSchema);
