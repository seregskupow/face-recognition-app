import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserRepository } from '../repositories/user.repository';
import { User, UserDocument } from '../schemas/user.schema';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async update(oldUser: User): Promise<User> {
    return this.userRepository.update(oldUser);
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOneById(new Types.ObjectId(id));
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }
}
