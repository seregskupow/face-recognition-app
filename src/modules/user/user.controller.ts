import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/createUser.dto';
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
      password: 'sadasd',
    };
    return plainToClass(User, user);
  }
}
