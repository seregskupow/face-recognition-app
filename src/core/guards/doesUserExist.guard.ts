import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotAcceptableException,
} from '@nestjs/common';
import * as multer from 'multer';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postMulterRequest: any = await new Promise((resolve, reject) => {
      multer().single('avatar')(request, {} as any, function (err) {
        if (err) reject(err);
        resolve(request);
      });
    });
    const email = postMulterRequest.body.email;
    return this.validateRequest(email);
  }

  async validateRequest(email) {
    const userExist = await this.userService.findOneByEmail(email);
    if (userExist) {
      throw new NotAcceptableException('This email already exist');
    }
    return true;
  }
}
