import axios from 'axios';
import { load } from '../../../routes/data/[id]/+page.server';
import { sampleEndpoint, sampleFileData } from '../../utils/data.test';

const axiosGetMock = jest.spyOn(axios, 'get');

describe('load function', () => {
    it('loads data successfully', async () => {
        const sampleHeader = Object.keys(sampleFileData);
        const sampleFileId = '00000000000000data.csv';

        axiosGetMock.mockResolvedValue({
            status: 200,
            data: {
                header: sampleHeader
            }
        });

        const params = { id: sampleFileId };
        const result = await load({ params });

        expect(result).toEqual({
            fileId: sampleFileId,
            fileName: sampleFileId.slice(14),
            header: sampleHeader
        });

        expect(axios.get).toHaveBeenCalledWith(
            `${sampleEndpoint}/meta/${sampleFileId}`
        );
    });

    it('handles network error', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(
            new Error('Network error.')
        );
        const fileId = 'data.csv';
        const params = { id: fileId };

        await expect(load({ params })).rejects.toThrow('Network error.');

        expect(axios.get).toHaveBeenCalledWith(
            `${sampleEndpoint}/meta/${fileId}`
        );
    });
});
