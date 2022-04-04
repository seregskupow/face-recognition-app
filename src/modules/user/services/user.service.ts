import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserHistoryRepository } from '../repositories/user-history.repository';
import { UserRepository } from '../repositories/user.repository';
import { User, UserDocument } from '../schemas/user.schema';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userHistoryRepository: UserHistoryRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
    await this.userHistoryRepository.deleteAll(id);
  }

  async update(id: string, oldUser: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, oldUser);
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOneById(new Types.ObjectId(id));
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }
}
