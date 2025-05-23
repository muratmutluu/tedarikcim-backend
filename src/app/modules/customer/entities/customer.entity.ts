import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @ApiProperty({
    example: "Murat's Company",
    description: 'Company name of the customer',
  })
  @Column()
  companyName: string;

  @ApiProperty({
    example: '123 Main Street, Istanbul',
    description: 'Address of the customer',
    required: false,
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    example: '+90 555 555 5555',
    description: 'Phone number of the customer',
    required: false,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Email address of the customer',
    required: false,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    example: 'Istanbul Tax Office',
    description: 'Tax office of the customer',
    required: false,
  })
  @Column({ nullable: true })
  taxOffice: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tax number of the customer',
    required: false,
  })
  @Column({ nullable: true })
  taxNumber: string;

  @ApiProperty({
    example: 1000.5,
    description: 'Balance of the customer',
    default: 0,
  })
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
  balance: number;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.customer, {
    onDelete: 'CASCADE',
  })
  transactions: Relation<TransactionEntity[]>;
}
