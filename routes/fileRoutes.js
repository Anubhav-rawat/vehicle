// routes/fileRoutes.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const router = express.Router();

// Define the file schema and model
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
});
const File = mongoose.model("File", fileSchema);

// Configure multer for file uploads
const upload = multer({
  dest: process.env.UPLOAD_PATH || "uploads/",
});

// POST /upload: Uploads a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, originalname, path } = req.file;

    // Save file details to MongoDB
    const file = new File({ filename, originalname, path });
    await file.save();

    res.status(200).json({ fileId: file._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// GET /file/:id: Retrieves a file by ID
router.get("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(file.path, file.originalname);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve file" });
  }
});

export default router;
