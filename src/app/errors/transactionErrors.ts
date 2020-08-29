import AppError from './AppError';

export default {
  notFound: new AppError(403, '01-001', 'Transaction not found.'),
  invalidType: new AppError(
    403,
    '01-002',
    "Transaction type must be either 'income' or 'outcome'.",
  ),
  exceedsTotal: new AppError(
    400,
    '01-003',
    'Transaction value exceeds account total.',
  ),
};
