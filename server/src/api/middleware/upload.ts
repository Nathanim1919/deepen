import multer from "multer";

const ALLOWED_MIMETYPES = ["application/pdf", "text/plain"];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and TXT files are allowed"));
    }
  },
});
