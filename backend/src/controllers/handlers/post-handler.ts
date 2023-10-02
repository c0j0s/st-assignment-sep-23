import { Request, Response } from "express";

export const uploadFile = async (request: Request, response: Response) => {
    if (!request.file) {
        return response.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, size } = request.file;
    console.log(`Uploaded file: ${originalname} (${size} bytes)`);

    const modifiedFilename = request.file.filename;
    return response.status(200).json({
        message: 'File uploaded successfully',
        data: modifiedFilename
    });
}