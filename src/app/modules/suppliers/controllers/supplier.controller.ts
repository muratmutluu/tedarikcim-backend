import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { UserRole } from 'src/app/common/enums/user-role.enum';

@ApiTags('Suppliers')
@ApiBearerAuth('JWT-auth')
@Roles(UserRole.ADMIN)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.findOneById(id);
  }

  @Get()
  async findAll(@Query('withBalance') withBalance?: string) {
    if (withBalance === 'true') {
      return await this.supplierService.findAllWithBalance();
    }
    return await this.supplierService.findAll();
  }

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.create(createSupplierDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return await this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.delete(id);
  }
}
