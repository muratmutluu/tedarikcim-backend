import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateSupplierTransactionDto } from '../dtos/create-supplier-transaction.dto';
import { SupplierTransactionType } from '../enums/supplier-transaction-type.enum';

type TransactionFields = Pick<
  CreateSupplierTransactionDto,
  | 'transactionType'
  | 'quantity'
  | 'quantityUnit'
  | 'unitPrice'
  | 'totalAmount'
  | 'paidAmount'
>;

@ValidatorConstraint({ async: false })
export class TransactionFieldsConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as TransactionFields;

    if (obj.transactionType === SupplierTransactionType.PURCHASE) {
      // PURCHASE için paidAmount olmamalı
      return obj.paidAmount === undefined;
    }

    if (obj.transactionType === SupplierTransactionType.PAYMENT) {
      // PAYMENT için quantity, quantityUnit, unitPrice olmamalı
      return (
        obj.quantity === undefined &&
        obj.quantityUnit === undefined &&
        obj.unitPrice === undefined &&
        obj.totalAmount === undefined
      );
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const obj = args.object as TransactionFields;
    if (obj.transactionType === SupplierTransactionType.PURCHASE) {
      return 'PURCHASE transactions should not have a paidAmount.';
    }

    if (obj.transactionType === SupplierTransactionType.PAYMENT) {
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
