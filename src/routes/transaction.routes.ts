import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {

  try {
    const transactions = transactionsRepository.all();

    return response.json(transactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const createRepository = new CreateTransactionService(
      transactionsRepository
    );

    const repository = createRepository.execute({
      title,
      value,
      type,
    });

    return response.json(repository);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
