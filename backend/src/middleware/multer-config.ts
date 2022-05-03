import { Request } from "express";
import multer from "multer";
import path from "path";

const MIME_TYPES: any = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (_: Request, file, callback) => {
    let name = path.parse(file.originalname).name.split(" ").join("_");
    if (name.length > 15) {
      name = name.substring(0, 14);
    }
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + "_" + Date.now() + "." + extension);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 4 }
}).single("image");
