import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import transactionErrors from '../errors/transactionErrors';

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
      throw transactionErrors.invalidType;

    const transactionsRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (value > total) throw transactionErrors.exceedsTotal;
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
