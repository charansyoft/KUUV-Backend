import multer from "multer";

// Store files in memory buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log("📂 Uploaded file mimetype:", file.mimetype);
    const allowedTypes = ["image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG images are allowed"));
    }
  },
});

export { upload };
