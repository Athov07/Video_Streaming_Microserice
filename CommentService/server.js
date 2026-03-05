import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/comments", commentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`CommentService running on port ${process.env.PORT}`);
});