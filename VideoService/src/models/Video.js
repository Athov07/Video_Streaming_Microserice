import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    userAvatar: {
      type: String,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,
    thumbnailUrl: String,

    category: {
      type: String,
      default: "public",
    },

    views: {
      type: Number,
      default: 0,
    },

    url: {
      type: String,
      required: true,
    },
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
