const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

// create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// serve images publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// upload API
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: imageUrl
  });
});

// test route
app.get("/", (req, res) => {
  res.send("Image Server Running 🚀");
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});