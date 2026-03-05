import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },

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
      default: "",
    },

    text: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);