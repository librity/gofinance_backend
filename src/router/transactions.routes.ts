import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsController from '../app/controllers/TransactionsController';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', TransactionsController.index);
transactionsRouter.post('/', TransactionsController.create);
transactionsRouter.delete('/:id', TransactionsController.destroy);
transactionsRouter.post(
  '/import',
  upload.single('file'),
  TransactionsController.import,
);

export default transactionsRouter;
