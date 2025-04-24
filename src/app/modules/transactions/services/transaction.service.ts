import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TransactionEntity,
  TransactionType,
} from '../entities/transaction.entity';
import { EntityManager, Repository } from 'typeorm';
import { CustomerService } from '../../customer/services/customer.service';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

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
    const totalAmount = this.calculateTotalAmount(createTransactionDto);
    return await this.transactionRepository.manager.transaction(
      async (manager) => {
        const transactionRepo = manager.getRepository(TransactionEntity);
        const newTransaction = transactionRepo.create({
          ...createTransactionDto,
          customer,
          totalAmount,
        });

        const savedTransaction = await transactionRepo.save(newTransaction);

        const newBalance = await this.calculateBalanceWithSQL(
          savedTransaction.customer.id,
          manager,
        );
        savedTransaction.customer.balance = newBalance;
        return savedTransaction;
      },
    );
  }

  async update(
    transactionId: number,
    updateDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const existing = await this.findOneById(transactionId);
    const customer = await this.customerService.findOneById(
      updateDto.customerId,
    );
    const totalAmount = this.calculateTotalAmount(updateDto);

    return await this.transactionRepository.manager.transaction(
      async (manager) => {
        const transactionRepo = manager.getRepository(TransactionEntity);

        const updatedTransaction = transactionRepo.merge(existing, {
          ...updateDto,
          customer,
          totalAmount,
        });

        const saved = await transactionRepo.save(updatedTransaction);

        const newBalance = await this.calculateBalanceWithSQL(
          saved.customer.id,
          manager,
        );
        saved.customer.balance = newBalance;
        return saved;
      },
    );
  }

  async remove(transactionId: number): Promise<void> {
    const transaction = await this.findOneById(transactionId);

    return await this.transactionRepository.manager.transaction(
      async (manager) => {
        const transactionRepo = manager.getRepository(TransactionEntity);
        await transactionRepo.remove(transaction);
        const newBalance = await this.calculateBalanceWithSQL(
          transaction.customer.id,
          manager,
        );
        transaction.customer.balance = newBalance;
      },
    );
  }

  async findOneById(transactionId: number): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['customer'],
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }
    return transaction;
  }

  async findByCustomer(
    customerId: number,
  ): Promise<{ customer: CustomerEntity; transactions: TransactionEntity[] }> {
    const customer = await this.customerService.findOneById(customerId);

    const transactions = await this.transactionRepository.find({
      where: { customer: { id: customerId } },
    });
    return {
      customer,
      transactions,
    };
  }

  private calculateTotalAmount(
    transactionDto: CreateTransactionDto | UpdateTransactionDto,
  ): number {
    const { quantity, unitPrice } = transactionDto;
    return quantity && unitPrice ? quantity * unitPrice : 0;
  }

  private async calculateBalance(
    customerId: number,
    manager: EntityManager,
  ): Promise<number> {
    const transactions = await manager.find(TransactionEntity, {
      where: { customer: { id: customerId } },
    });

    let balance = 0;

    for (const transaction of transactions) {
      if (transaction.transactionType === TransactionType.SALE) {
        balance += transaction.totalAmount || 0;
      } else if (transaction.transactionType === TransactionType.PAYMENT) {
        balance -= transaction.receivedAmount || 0;
      }
    }

    await manager.update(CustomerEntity, customerId, { balance });
    return balance;
  }

  private async calculateBalanceWithSQL(
    customerId: number,
    manager: EntityManager,
  ): Promise<number> {
    // TypeORM'un QueryBuilder kullanarak sütun isimlerini otomatik ele almak
    const salesTotal = await manager
      .getRepository(TransactionEntity)
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.totalAmount), 0)', 'total')
      .where('transaction.customer.id = :customerId', { customerId })
      .andWhere('transaction.transactionType = :type', {
        type: TransactionType.SALE,
      })
      .getRawOne<{ total: string }>();

    const paymentsTotal = await manager
      .getRepository(TransactionEntity)
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.receivedAmount), 0)', 'total')
      .where('transaction.customer.id = :customerId', { customerId })
      .andWhere('transaction.transactionType = :type', {
        type: TransactionType.PAYMENT,
      })
      .getRawOne<{ total: string }>();

    const balance = Number(salesTotal?.total) - Number(paymentsTotal?.total);

    await manager.update(CustomerEntity, customerId, { balance });
    return balance;
  }
}
