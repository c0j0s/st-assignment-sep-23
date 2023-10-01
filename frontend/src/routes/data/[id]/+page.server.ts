import type { AxiosResponse } from 'axios';
import axios from 'axios';

const endpoint = `http://localhost:3000/meta`;

export async function load({ params }) {
    const fileId = params.id;
	const fileName = fileId.slice(14);
    const url = `${endpoint}/${fileId}`;
    const res = await axios.get(url) as AxiosResponse;

    if (res.status === 200) {
        console.log(res.data);
        var contentCount = res.data['count'];
        var header: string[] = res.data['header'];
    } else {
        throw new Error("Network error.");
    }

	return {
        fileId,
		fileName,
        header,
        contentCount,
	};
}
