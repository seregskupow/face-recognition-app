import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './schemas/user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async update(oldUser: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      oldUser._id,
      {
        ...oldUser,
      },
      { new: true },
    );
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
}
