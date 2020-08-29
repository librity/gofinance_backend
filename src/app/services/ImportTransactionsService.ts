import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import CreateTransactionService, {
  CreateTransactionDTO,
} from './CreateTransactionService';

interface ImportTransactionsDTO {
  pathToTransactionsCSV: string;
}

class ImportTransactionsService {
  static async execute({
    pathToTransactionsCSV,
  }: ImportTransactionsDTO): Promise<Transaction[]> {
    const trasactionsCSVFileStream = fs.createReadStream(pathToTransactionsCSV);

    const CSVParserStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parsedCSV = trasactionsCSVFileStream.pipe(CSVParserStream);

    const transactionsData: CreateTransactionDTO[] = [];

    parsedCSV.on('data', line => {
      const [title, type, stringValue, category] = line;

      const value = Number(stringValue);

      transactionsData.push({ title, type, value, category });
    });

    await new Promise(resolve => parsedCSV.on('end', resolve));

    const incomeTransactionsData = transactionsData.filter(
      transaction => transaction.type === 'income',
    );

    const incomeTransactions = await Promise.all(
      incomeTransactionsData.map(transactionData => {
        return CreateTransactionService.execute(transactionData);
      }),
    );

    const outcomeTransactionsData = transactionsData.filter(
      transaction => transaction.type === 'outcome',
    );

    const outcomeTransactions = await Promise.all(
      outcomeTransactionsData.map(transactionData => {
        return CreateTransactionService.execute(transactionData);
      }),
    );

    return Promise.all([...incomeTransactions, ...outcomeTransactions]);
  }
}

export default ImportTransactionsService;
