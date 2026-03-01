import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`VideoService running on port ${PORT}`));