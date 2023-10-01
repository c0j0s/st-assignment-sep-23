import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

export const createDirectory = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
};

const uploadDir = './uploads';

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

export const queryContent = (
    filename: string,
    keyword: string,
    start: number,
    end: number,
    success: (content: string[][], totalContentCount: number) => void,
    fail: (err: any) => void
) => {
    try {
        const results: string[][] = [];
        console.log(
            `[queryContent] reading ${filename}: find ${keyword} from ${start} -> ${end}`
        );

        fs.createReadStream(`${uploadDir}/${filename}`)
            .pipe(csv())
            .on('data', (row: any[]) => {
                if (
                    keyword !== '' &&
                    (Object.values(row).join('') as string).includes(keyword)
                ) {
                    results.push(row);
                } else if (keyword === '') {
                    results.push(row);
                }
            })
            .on('end', () => {
                success(results.slice(start, end), results.length);
            })
            .on('error', (error: any) => {
                fail(error);
            });
    } catch (error) {
        fail(error);
    }
};

export const readMetadata = (
    filename: string,
    success: (header: string[], count: number) => void,
    fail: (err: any) => void
) => {
    try {
        if (!fs.existsSync(uploadDir)) {
            fail('File not found');
            return;
        }

        const results: string[][] = [];
        console.log(`[readMetadata] reading ${filename}`);

        fs.createReadStream(`${uploadDir}/${filename}`)
            .pipe(csv())
            .on('data', (row: any[]) => {
                results.push(row);
            })
            .on('end', () => {
                if (results.length > 0) {
                    success(Object.keys(results[0]), results.length - 1);
                } else {
                    fail('File empty');
                }
            })
            .on('error', (error: any) => {
                fail(error);
            });
    } catch (error) {
        fail(error);
    }
};

export const getFiles = (success: (list: string[]) => void) => {
    try {
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
            success(files);
        });
    } catch (error) {
        console.log(error);
    }
};
