import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { error } from '@sveltejs/kit';
import type { AxiosError } from 'axios';

const endpoint = `http://localhost:3000/meta`;

export async function load({ params }) {
    try {
        const fileId = params.id;
        const fileName = fileId.slice(14);
        const url = `${endpoint}/${fileId}`;
        const res = (await axios.get(url)) as AxiosResponse;

        if (res.status === 200) {
            var header: string[] = res.data['header'];
        } else {
            throw error(404, 'File not found.');
        }

        return {
            fileId,
            fileName,
            header
        };
    } catch (err) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            throw error(axiosError.response?.status || 500, axiosError.message);
        } else {
            throw error(500, 'Network error');
        }
    }
}
