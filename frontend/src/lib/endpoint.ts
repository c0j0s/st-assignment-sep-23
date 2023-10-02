import type { AxiosResponse } from 'axios';
import axios from 'axios';

const endpoint = `http://localhost:3000`;

export async function queryFileData(
    fileId: string,
    keyword: string,
    page: number,
    limit: number = 10,
    success: (content: string[][], totalContentCount: number) => void,
    error: (err: string) => void
) {
    var url = `${endpoint}/query/${fileId}?page=${page}&limit=${limit}`;
    if (keyword !== '') {
        url += `&keyword=${keyword}`;
    }

    try {
        const res = (await axios.get(url)) as AxiosResponse;
        if (res.status === 200) {
            var data = res.data['content'] as any[];
            var totalContentCount = res.data['totalContentCount'];
            var content: string[][] = [];
            data.forEach((value) => {
                content.push(Object.values(value));
            });

            setTimeout(() => {
                success(content, totalContentCount);
            }, 500);
        } else {
            error('Network error.');
        }
    } catch (err) {
        error('Network error.');
    }
}

export async function postFile(
    data: FormData,
    onUploadProgress: (value: number) => void,
    success: (message: string, fileName: string) => void,
    error: (err: string) => void
) {
    const url = `${endpoint}/upload/`;

    try {
        const response = (await axios.post(url, data, {
            onUploadProgress: (progressEvent) => {
                onUploadProgress(
                    Math.round(
                        (progressEvent.loaded * 100) /
                            (progressEvent.total ?? 100)
                    )
                );
            }
        })) as AxiosResponse;

        if (response.status === 200) {
            success(response.data['message'], response.data['data']);
        } else {
            error('Network error.');
        }
    } catch (err) {
        error('Network error.');
    }
}

export async function getUploadedFiles(
    success: (file: string[]) => void,
    error: (err: string) => void
) {
    try {
        const response = (await axios.get(endpoint)) as AxiosResponse;

        if (response.status === 200) {
            success(response.data);
        } else {
            error('Network error.');
        }
    } catch (err) {
        error('Network error.');
    }
}
