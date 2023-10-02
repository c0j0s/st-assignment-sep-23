import { render, fireEvent } from '@testing-library/svelte';
import { getUploadedFiles, postFile, queryFileData } from '../../lib/endpoint';
import axios from 'axios';
import {
    sampleEndpoint,
    sampleFileData,
    sampleListOfFiles
} from '../utils/data.test';

const axiosGetMock = jest.spyOn(axios, 'get');
const axiosPostMock = jest.spyOn(axios, 'post');

describe('queryFileData', () => {
    afterEach(() => {
        axiosGetMock.mockReset();
    });

    it('should call success callback with data when the request is successful', async () => {
        const fileId = 'data.csv';
        const keyword = '';
        const page = 1;
        const limit = 10;

        const responseData = {
            content: sampleFileData,
            totalContentCount: sampleFileData.length
        };

        jest.useFakeTimers();

        axiosGetMock.mockResolvedValue({ status: 200, data: responseData });

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await queryFileData(
            fileId,
            keyword,
            page,
            limit,
            successCallback,
            errorCallback
        );

        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(fileId)
        );
        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(`page=${page}`)
        );
        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(`limit=${limit}`)
        );
        expect(axiosGetMock).not.toHaveBeenCalledWith(
            expect.stringContaining(`keyword=${keyword}`)
        );

        jest.runAllTimers();

        expect(successCallback).toHaveBeenCalledWith(
            responseData.content.map((item) => Object.values(item)),
            responseData.totalContentCount
        );

        expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should call success callback with data containing [keyword] when the request is successful', async () => {
        const fileId = 'data.csv';
        const keyword = '3';
        const page = 1;
        const limit = 10;

        const queryData = sampleFileData.filter((x) =>
            Object.values(x).includes(keyword)
        );

        const responseData = {
            content: queryData,
            totalContentCount: queryData.length
        };

        jest.useFakeTimers();

        axiosGetMock.mockResolvedValue({ status: 200, data: responseData });

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await queryFileData(
            fileId,
            keyword,
            page,
            limit,
            successCallback,
            errorCallback
        );

        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(fileId)
        );
        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(`page=${page}`)
        );
        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(`limit=${limit}`)
        );
        expect(axiosGetMock).toHaveBeenCalledWith(
            expect.stringContaining(`keyword=${keyword}`)
        );

        jest.runAllTimers();

        expect(successCallback).toHaveBeenCalledWith(
            responseData.content.map((item) => Object.values(item)),
            responseData.totalContentCount
        );

        expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should call error callback when the request fails', async () => {
        const fileId = 'data.csv';
        const keyword = '';
        const page = 1;
        const limit = 10;

        axiosGetMock.mockRejectedValue({ status: 500 });

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await queryFileData(
            fileId,
            keyword,
            page,
            limit,
            successCallback,
            errorCallback
        );

        expect(errorCallback).toHaveBeenCalledWith('Network error.');
        expect(successCallback).not.toHaveBeenCalled();
    });
});

describe('postFile', () => {
    afterEach(() => {
        axiosPostMock.mockReset();
    });

    it('should call success callback with message and file name when the upload is successful', async () => {
        const sampleFileName = 'uploaded-file.txt';
        const uploadSuccessMessage = 'File uploaded successfully';

        axiosPostMock.mockResolvedValue({
            status: 200,
            data: {
                message: uploadSuccessMessage,
                data: sampleFileName
            }
        });

        const formData = new FormData();
        formData.append('file', new Blob(['dummy']), sampleFileName);

        const onUploadProgress = jest.fn();
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await postFile(
            formData,
            onUploadProgress,
            successCallback,
            errorCallback
        );

        expect(axiosPostMock).toHaveBeenCalledWith(
            `${sampleEndpoint}/upload/`,
            formData,
            expect.any(Object)
        );

        expect(successCallback).toHaveBeenCalledWith(
            uploadSuccessMessage,
            sampleFileName
        );
        expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should call error callback when the upload fails', async () => {
        axiosPostMock.mockRejectedValue({ status: 500 });

        const formData = new FormData();
        formData.append(
            'file',
            new Blob(['file content']),
            'uploaded-file.txt'
        );

        const onUploadProgress = jest.fn();
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await postFile(
            formData,
            onUploadProgress,
            successCallback,
            errorCallback
        );

        expect(axiosPostMock).toHaveBeenCalledWith(
            `${sampleEndpoint}/upload/`,
            formData,
            expect.any(Object)
        );
        expect(onUploadProgress).not.toHaveBeenCalled();
        expect(successCallback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalledWith('Network error.');
    });
});

describe('getUploadedFiles', () => {
    afterEach(() => {
        axiosGetMock.mockReset();
    });

    it('should call success callback with data when the request is successful', async () => {
        axiosGetMock.mockResolvedValue({
            status: 200,
            data: sampleListOfFiles
        });

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await getUploadedFiles(successCallback, errorCallback);

        expect(axiosGetMock).toHaveBeenCalledWith(sampleEndpoint);
        expect(successCallback).toHaveBeenCalledWith(sampleListOfFiles);
        expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should call error callback when the request fails', async () => {
        axiosGetMock.mockRejectedValue({ status: 500 });

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        await getUploadedFiles(successCallback, errorCallback);

        expect(axiosGetMock).toHaveBeenCalledWith(sampleEndpoint);
        expect(successCallback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalledWith('Network error.');
    });
});
