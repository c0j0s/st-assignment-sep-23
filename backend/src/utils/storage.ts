import multer from "multer";
import fs from 'fs';
const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Modify uploaded file name
        const timestamp = Date.now();
        const modifiedFilename = `${timestamp}-${file.originalname}`;
        cb(null, modifiedFilename);
    },
});

export const storage = multer({ storage: localStorage });
