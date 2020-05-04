import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface DeleteTransactionDTO {
  transaction_id: string;
}

class DeleteTransactionService {
  public static async execute({
    transaction_id,
  }: DeleteTransactionDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionExists = await transactionsRepository.findOne({
      where: { id: transaction_id },
    });

    if (!transactionExists) throw new AppError('Transaction not found.', 403);

    await transactionsRepository.delete(transactionExists.id);
  }
}

export default DeleteTransactionService;
