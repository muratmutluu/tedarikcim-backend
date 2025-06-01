import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { UserRole } from 'src/app/common/enums/user-role.enum';

@ApiTags('Invoices')
@ApiBearerAuth('JWT-auth')
@Roles(UserRole.ADMIN)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.invoiceService.findOneById(id);
  }

  @Get()
  async findAll() {
    return await this.invoiceService.findAll();
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.create(createInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.invoiceService.remove(id);
  }
}
