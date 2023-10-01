import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

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
    }
});

export const storage = multer({ storage: localStorage });

export const readContent = (
    filename: string,
    start: number,
    end: number,
    success: (data: string[][]) => void,
    fail: (err: any) => void
) => {
    const results: string[][] = [];
    console.log(`[readContent] reading ${filename}: ${start} -> ${end}`);

    fs.createReadStream(`${uploadDir}/${filename}`)
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            success(results.slice(start, end));
        })
        .on('error', (error) => {
            fail(error);
        });
};

export const readMetadata = (
    filename: string,
    success: (header: string[], count: number) => void,
    fail: (err: any) => void
) => {
    const results: string[][] = [];
    console.log(`[readMetadata] reading ${filename}`);

    fs.createReadStream(`${uploadDir}/${filename}`)
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            if (results.length > 0) {
                success(Object.keys(results[0]), results.length - 1);
            } else {
                fail('File empty');
            }
        })
        .on('error', (error) => {
            fail(error);
        });
};
