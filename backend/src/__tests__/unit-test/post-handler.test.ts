import express, { Request, Response } from 'express';
import { uploadFile } from "../../controllers";

const app = express();
app.post('/upload', uploadFile);

// Mock Express request and response objects
const mockRequest = {
    file: {
        originalname: 'data.csv',
        size: 12345,
        filename: 'example_12345.txt',
    },
} as Request;

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as unknown as Response;

describe('POST /upload', () => {
    it('should respond with success message and modified filename on successful upload', async () => {
        await uploadFile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'File uploaded successfully',
            data: 'example_12345.txt',
        });
    });

    it('should respond with a 400 error if no file is uploaded', async () => {
        mockRequest.file = undefined;
        await uploadFile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No file uploaded.' });
    });
});
