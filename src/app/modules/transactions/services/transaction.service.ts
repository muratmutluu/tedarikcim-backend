import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TransactionEntity,
  TransactionType,
} from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { CustomerService } from '../../customer/services/customer.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CustomerEntity } from '../../customer/entities/customer.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    private readonly customerService: CustomerService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const customer = await this.customerService.findOneById(
      createTransactionDto.customerId,
    );

    return await this.transactionRepository.manager.transaction(
      async (manager) => {
        const transaction = manager.create(TransactionEntity, {
          ...createTransactionDto,
          customer,
        });

        if (createTransactionDto.transactionType === TransactionType.SALE) {
          transaction.totalAmount =
            (createTransactionDto.quantity ?? 0) *
            (createTransactionDto.unitPrice ?? 0);
          customer.balance += transaction.totalAmount;
        }
        if (createTransactionDto.transactionType === TransactionType.PAYMENT) {
          customer.balance -= transaction.receivedAmount;
        }

        transaction.balanceAfterTransaction = customer.balance;
        transaction.customer = customer;

        await Promise.all([manager.save(customer), manager.save(transaction)]);

        return transaction;
      },
    );
  }

  async findByCustomer(customerId: number): Promise<{
    customer: CustomerEntity;
    transactions: TransactionEntity[];
  }> {
    const customer = await this.customerService.findOneById(customerId);

    const transactions = await this.transactionRepository.find({
      where: { customer: { id: customerId } },
    });
    return {
      customer,
      transactions,
    };
  }
}
