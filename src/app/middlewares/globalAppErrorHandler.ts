import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export default (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.httpCode).json({
      status: 'error',
      internalCode: err.internalCode,
      message: err.description,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
};
