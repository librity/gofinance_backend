import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return res.json({ transactions, balance });
});

transactionsRouter.post('/', async (req, res) => {
  const { title, value, type, category } = req.body;

  const newTransaction = await CreateTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return res.json(newTransaction);
});

transactionsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await DeleteTransactionService.execute({
    transaction_id: id,
  });

  return res.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  const createdTransactions = await ImportTransactionsService.execute({
    pathToTransactionsCSV: req.file.path,
  });

  return res.json(createdTransactions);
});

export default transactionsRouter;
