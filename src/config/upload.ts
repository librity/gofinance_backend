import { resolve } from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpDirectoryPath = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpDirectoryPath,

  storage: multer.diskStorage({
    destination: tmpDirectoryPath,

    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}_${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
