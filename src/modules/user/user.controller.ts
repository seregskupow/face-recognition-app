import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() userData: CreateUserDto) {
    const newUser = this.userService.create(userData);
    return newUser;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/test')
  async get(): Promise<UserDto> {
    const user: UserDto = {
      _id: 'sadasd',
      name: 'asdasd',
      email: 'asdasd',
      password: 'sadasd2',
    };
    return plainToClass(User, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/id/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findOneByEmail(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.update(updateUserDto);
  }
}
