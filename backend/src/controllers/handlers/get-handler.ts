import { Request, Response } from "express";
import { getFiles, queryContent, readMetadata } from "../../lib/storage";


export const getUploadedFiles = async (_: Request, response: Response) => {
    getFiles((files) => {
        response.status(200).json(files);
    });
}

export const getFileMetaData = async (request: Request, response: Response) => {
    try {
        readMetadata(
            request.params['filepath'],
            (header: string[], count: number) => {
                response.status(200).json({
                    header: header
                });
            },
            (err: any) => {
                response.status(404).json({ error: "File not found." });
            }
        );
    } catch (error) {
        return response.status(500).json({ error: "Internal server error." });
    }
}

export const queryFileData = async (request: Request, response: Response) => {
    try {
        const fileId = request.params['filepath'];
        const keyword = (request.query.keyword as string) || '';
        const page = parseInt(request.query.page as string) || 1;
        const limit = parseInt(request.query.limit as string) || 10;

        let start = (page - 1) * limit;
        let end = start + limit;

        queryContent(
            fileId,
            keyword,
            start,
            end,
            (content: string[][], totalContentCount: number) => {
                response.status(200).json({
                    page: page,
                    content: content,
                    totalContentCount: totalContentCount
                });
            },
            (err: string) => {
                response.status(404).json({ error: "File not found." });
            }
        );
    } catch (error) {
        return response.status(500).json({ error: "Internal server error." });
    }
}