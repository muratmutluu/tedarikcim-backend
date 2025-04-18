import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserFindAllResult, UserService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users',
  })
  findAll(@Query() paginationDto: PaginationDto): Promise<UserFindAllResult> {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOneById(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
