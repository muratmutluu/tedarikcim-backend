import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { CustomerEntity } from '../../customer/entities/customer.entity';

export enum TransactionType {
  SALE = 'SALE',
  PAYMENT = 'PAYMENT',
}

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'date', nullable: false })
  transactionDate: Date;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  quantity: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  quantityUnit: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    default: 0,
  })
  totalAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  receivedAmount: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  customer: Relation<CustomerEntity>;
}
