import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Response {
    const response = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return response;
  }

  public getBalance(): Balance {
    const balanceTransactions = this.transactions.reduce(
      (accumulator, current) => {
        if (current.type === 'income') {
          return {
            income: accumulator.income + current.value,
            outcome: accumulator.outcome,
          };
        }
        return {
          income: accumulator.income,
          outcome: accumulator.outcome + current.value,
        };
      },
      { income: 0, outcome: 0 },
    );

    const balance = {
      ...balanceTransactions,
      total: balanceTransactions.income - balanceTransactions.outcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome') {
      if (this.getBalance().total < transaction.value) {
        throw Error('Insufficient balance to carry out transaction.');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
