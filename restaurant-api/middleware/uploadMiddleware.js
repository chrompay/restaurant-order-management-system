const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AppError = require("../utils/AppError");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new AppError("Only JPEG, PNG, and WEBP images are allowed", 400), false);
};

// Factory so every upload target (food images, avatars, ...) gets its own
// subfolder while sharing the same type/size validation.
const createUploader = (subfolder) => {
  const uploadDir = path.join(__dirname, "..", "uploads", subfolder);

  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      cb(null, `${Date.now()}-${sanitizedName}`);
    }
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024
    }
  });
};

module.exports = createUploader;
