import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

export interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public static async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionDTO): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome')
      throw new AppError(
        "Transaction type must be either 'income' or 'outcome'",
        403,
      );

    const transactionsRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (value > total)
        throw new AppError('Transaction value exceeds account total.', 400);
    }

    const categoriesRepository = getRepository(Category);
    const categoryAlreadyExists = await categoriesRepository.findOne({
      where: { title: category },
    });
    let category_id;

    if (categoryAlreadyExists) {
      category_id = categoryAlreadyExists.id;
    } else {
      const newCategory = await categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
