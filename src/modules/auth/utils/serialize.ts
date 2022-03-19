import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { User } from '@modules/user/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done) {
    done(null, user._id);
  }

  async deserializeUser(userId: string, done) {
    const user = await this.userService.findOneById(userId);
    if (user)
      return done(null, {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    return done(null, null);
  }
}
