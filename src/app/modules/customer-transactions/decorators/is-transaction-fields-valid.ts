import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateCustomerTransactionDto } from '../dtos/create-customer-transaction.dto';
import { CustomerTransactionType } from '../enums/customer-transaction-type.enum';

type TransactionFields = Pick<
  CreateCustomerTransactionDto,
  | 'transactionType'
  | 'quantity'
  | 'quantityUnit'
  | 'unitPrice'
  | 'totalAmount'
  | 'receivedAmount'
>;

@ValidatorConstraint({ async: false })
export class TransactionFieldsConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as TransactionFields;

    if (obj.transactionType === CustomerTransactionType.SALE) {
      // SALE için receivedAmount olmamalı
      return obj.receivedAmount === undefined;
    }

    if (obj.transactionType === CustomerTransactionType.PAYMENT) {
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
    if (obj.transactionType === CustomerTransactionType.SALE) {
      return 'SALE transactions should not have a receivedAmount.';
    }

    if (obj.transactionType === CustomerTransactionType.PAYMENT) {
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
