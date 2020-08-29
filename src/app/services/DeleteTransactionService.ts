import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import transactionErrors from '../errors/transactionErrors';

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

    if (!transactionExists) throw transactionErrors.notFound;

    await transactionsRepository.delete(transactionExists.id);
  }
}

export default DeleteTransactionService;
