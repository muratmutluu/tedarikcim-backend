import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export interface CustomerFindAllResult {
  total: number;
  customers: CustomerEntity[];
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<CustomerFindAllResult> {
    const { page = 1, pageSize = 10 } = paginationDto;

    const [customers, total] = await this.customerRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { total, customers };
  }

  async findAll(): Promise<CustomerFindAllResult> {
    const customers = await this.customerRepository.find({
      order: { createdAt: 'DESC' },
    });

    const total = customers.length;

    return { total, customers };
  }

  async findOneById(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = await this.findOneById(id);
    this.customerRepository.merge(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOneById(id);
    await this.customerRepository.remove(customer);
  }
}
