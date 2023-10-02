import request from 'supertest';
import express, { Request, Response } from 'express';
import { getFiles, readMetadata, queryContent } from '../../lib/storage';
import {
    getFileMetaData,
    getUploadedFiles,
    queryFileData
} from '../../controllers';
import { sampleFileData, sampleListOfFiles } from '../utils/data.test';

const app = express();
app.get('/', getUploadedFiles);
app.get('/meta/:filepath', getFileMetaData);
app.get('/query/:filepath', queryFileData);

const sampleHeaders = Object.keys(sampleFileData);

jest.mock('../../lib/storage', () => ({
    readMetadata: jest.fn(),
    queryContent: jest.fn(),
    getFiles: jest.fn()
}));

describe('GET /', () => {
    it('should respond with uploaded files', async () => {
        // Mock the getFiles function
        (getFiles as jest.Mock).mockImplementation((callback) => {
            const files = sampleListOfFiles;
            callback(files);
        });

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleListOfFiles);
    });

    it('should respond with empty list', async () => {
        // Mock the getFiles function
        (getFiles as jest.Mock).mockImplementation((callback) => {
            callback([]);
        });

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe('GET /meta/:filepath', () => {
    it('should respond with file metadata', async () => {
        (readMetadata as jest.Mock).mockImplementation(
            (filepath, successCallback, errorCallback) => {
                successCallback(sampleHeaders, 2);
            }
        );

        const response = await request(app).get('/meta/data.csv');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ header: sampleHeaders });
    });

    it('should respond with file not found error', async () => {
        (readMetadata as jest.Mock).mockImplementation(
            (filepath, successCallback, errorCallback) => {
                errorCallback('Not found');
            }
        );

        const response = await request(app).get('/meta/data.csv');

        expect(response.status).toBe(404);
    });
});

describe('GET /query/:filepath', () => {
    it('should respond with file data', async () => {
        (queryContent as jest.Mock).mockImplementation(
            (filepath, keyword, start, end, successCallback, errorCallback) => {
                successCallback(sampleFileData, 4);
            }
        );

        const response = await request(app).get(
            '/query/data.csv?page=1&limit=10'
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            page: 1,
            content: sampleFileData,
            totalContentCount: 4
        });
    });

    it('should respond with file data (without query)', async () => {
        (queryContent as jest.Mock).mockImplementation(
            (filepath, keyword, start, end, successCallback, errorCallback) => {
                successCallback(sampleFileData, 4);
            }
        );

        const response = await request(app).get(`/query/data.csv`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            page: 1,
            content: sampleFileData,
            totalContentCount: 4
        });
    });

    it('should respond with file not found error', async () => {
        (queryContent as jest.Mock).mockImplementation(
            (filepath, successCallback, errorCallback) => {
                errorCallback('Not found');
            }
        );

        const response = await request(app).get('/meta/data.csv');

        expect(response.status).toBe(404);
    });
});
