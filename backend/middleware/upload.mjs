import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const processFiles = async (files, folderMap = {}) => {
  const uploadedFiles = {};

  if (!files) return uploadedFiles;

  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  for (const field in files) {
    const fileArray = files[field];

    uploadedFiles[field] = [];

    // 👉 dynamic folder
    const folder = folderMap[field] || "";
    const uploadPath = folder ? `uploads/${folder}` : "uploads";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    for (const file of fileArray) {
      let fileName;
      let filePath;

      if (file.mimetype.startsWith("image")) {
        fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.webp`;

        filePath = path.join(uploadPath, fileName);

        await sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(filePath);
      } else {
        fileName = `${Date.now()}-${file.originalname}`;
        filePath = path.join(uploadPath, fileName);

        fs.writeFileSync(filePath, file.buffer);
      }

      const fileUrl = folder
        ? `/uploads/${folder}/${fileName}`
        : `/uploads/${fileName}`;

      uploadedFiles[field].push(fileUrl);
    }
  }

  return uploadedFiles;
};

export default upload;