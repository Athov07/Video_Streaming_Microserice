import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`UserProfileService running on port ${PORT}`));