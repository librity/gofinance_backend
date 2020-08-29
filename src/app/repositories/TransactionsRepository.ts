import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const numberOfTransactions = await this.count();

    if (numberOfTransactions === 0) {
      return {
        income: 0,
        outcome: 0,
        total: 0,
      };
    }

    const allTransactions = await this.find();

    const totalIncome = this.calulateTotalIncome(allTransactions);
    const totalOutcome = this.calulateTotalOutcome(allTransactions);

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
  }

  private calulateTotalIncome(transactions: Transaction[]): number {
    const incomeTransactions = transactions.filter(
      transaction => transaction.type === 'income',
    );

    if (incomeTransactions.length === 0) return 0;

    const incomeArray = incomeTransactions.map(
      transaction => transaction.value,
    );

    return incomeArray.reduce((income, sum) => sum + income);
  }

  private calulateTotalOutcome(transactions: Transaction[]): number {
    const outcomeTransactions = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    if (outcomeTransactions.length === 0) return 0;

    const outcomeArray = outcomeTransactions.map(
      transaction => transaction.value,
    );

    return outcomeArray.reduce((outcome, sum) => sum + outcome);
  }
}

export default TransactionsRepository;
