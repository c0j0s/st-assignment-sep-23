import type { AxiosResponse } from 'axios';
import axios from 'axios';

const endpoint = `http://localhost:3000`;

export async function loadPage(
    fileId: string, 
    page: number, 
    limit: number = 10,
    success: (content: string[][]) => void,
    ) {
    if (page < 1) {
        page = 1;
    }

    const url = `${endpoint}/data/${fileId}?page=${page}&limit=${limit}`;
    const res = await axios.get(url) as AxiosResponse;

    if (res.status === 200) {
        var data = res.data['data'] as any[];
        if (data.length > 0) {
            var content: string[][] = [];
            data.forEach(value => {
                content.push(Object.values(value))
            })

            setTimeout(() => {
                success(content);
            }, 1000)
        }
    } else {
        throw new Error("Network error.");
    }
}

export async function postFile(
    data: FormData,
    onUploadProgress: (value: number) => void,
    success: (message: string, fileName: string) => void,
    error: (err: string) => void,
) {
    const url = `${endpoint}/upload/`;

    const response = (await axios.post(url, data, {
        onUploadProgress: (progressEvent) => {
          onUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 100)));
        }
      })) as AxiosResponse;

      if (response.status === 200) {
        success(response.data['message'], response.data['data']);
      } else {
        console.log(response.headers);
        error("Network error.")
      }
}