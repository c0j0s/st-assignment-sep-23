import express from 'express';
import {
    getFileMetaData,
    getUploadedFiles,
    queryFileData,
    uploadFile
} from '../controllers';
import { storage } from '../lib/storage';

const router = express.Router();

router.route('/').get(getUploadedFiles);

router.route('/meta/:filepath').get(getFileMetaData);

router.route('/query/:filepath').get(queryFileData);

router.route('/upload').post(storage.single('file'), uploadFile);

export default router;
