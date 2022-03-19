import * as bcrypt from 'bcrypt';

import { User } from '@modules/user/schemas/user.schema';
import { UserService } from '@modules/user/services/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { googlePayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  public async validateUser(userEmail: string, pass: string): Promise<User> {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user) {
      return null;
    }
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    return user;
  }

  public async createUser(user): Promise<User> {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.userService.create({ ...user, password: pass });

    return newUser;
  }

  public async validateUserGoogle(payload: googlePayload): Promise<User> {
    const { email, firstName: name, picture: avatar, googleId } = payload;

    const user = await this.userService.findOneByEmail(email);
    if (user)
      return await this.userService.update({
        _id: user._id,
        email,
        name,
        avatar,
      });

    const newUser = await this.userService.create({
      email,
      name,
      password: null,
      avatar,
      googleId,
      activated: true,
    });
    return newUser;
  }

  private async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.decode(token);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
