import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

class TransactionsController {
  static async index(req: Request, res: Response): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();

    return res.json({ transactions, balance });
  }

  static async create(req: Request, res: Response): Promise<Response> {
    const { title, value, type, category } = req.body;

    const newTransaction = await CreateTransactionService.execute({
      title,
      value,
      type,
      category,
    });

    return res.json(newTransaction);
  }

  static async destroy(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await DeleteTransactionService.execute({
      transaction_id: id,
    });

    return res.status(204).send();
  }

  static async import(req: Request, res: Response): Promise<Response> {
    const createdTransactions = await ImportTransactionsService.execute({
      pathToTransactionsCSV: req.file.path,
    });

    return res.json(createdTransactions);
  }
}

export default TransactionsController;
