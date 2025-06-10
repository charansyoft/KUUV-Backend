const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.patch("/profile", authenticateToken, upload.single("image"), (req, res) => {
  // req.file contains uploaded image info
  // req.body.name and req.body.description contain other fields

  // Save info to DB here...

  res.json({ message: "Profile updated!" });
});
