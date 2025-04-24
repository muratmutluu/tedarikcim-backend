// src/validators/TransactionFieldsValidator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

@ValidatorConstraint({ async: false })
export class TransactionFieldsConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as {
      transactionType: TransactionType;
      receivedAmount?: number;
      quantity?: number;
      quantityUnit?: string;
      unitPrice?: number;
    };

    if (obj.transactionType === TransactionType.SALE) {
      // SALE için receivedAmount olmamalı
      return obj.receivedAmount === undefined;
    }

    if (obj.transactionType === TransactionType.PAYMENT) {
      // PAYMENT için quantity, quantityUnit, unitPrice olmamalı
      return (
        obj.quantity === undefined &&
        obj.quantityUnit === undefined &&
        obj.unitPrice === undefined
      );
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const obj = args.object as {
      transactionType: TransactionType;
      receivedAmount?: number;
      quantity?: number;
      quantityUnit?: string;
      unitPrice?: number;
    };
    if (obj.transactionType === TransactionType.SALE) {
      return 'SALE transactions should not have a receivedAmount.';
    }

    if (obj.transactionType === TransactionType.PAYMENT) {
      return 'PAYMENT transactions should not have quantity, quantityUnit, or unitPrice.';
    }

    return 'Invalid transaction type or conflicting fields.';
  }
}

export function IsTransactionFieldsValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TransactionFieldsConstraint,
    });
  };
}
