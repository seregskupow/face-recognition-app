import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    const user = await newUser.save();
    return plainToClass(User, user.toObject());
  }

  async update(oldUser: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        oldUser._id,
        {
          ...oldUser,
        },
        { new: true },
      )
      .exec();
    return plainToClass(User, user);
  }

  async findOneById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).lean().exec();
    return plainToClass(User, user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return plainToClass(User, user);
  }
}
