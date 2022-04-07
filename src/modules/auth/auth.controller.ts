import { AuthenticatedGuard } from '@core/guards/authenticated.guard';
import { DoesUserExist } from '@core/guards/doesUserExist.guard';
import { GoogleAuthGuard } from '@core/guards/googleAuth.guard';
import { LocalAuthGuard } from '@core/guards/localAuth.guard';
import { ImgUploadService } from '@core/imageUploader/img-upload.service';
import MongooseClassSerializerInterceptor from '@core/interceptors/mongoose.interceptor';
import { CreateUserDto } from '@modules/user/dto/createUser.dto';
import { UserDto } from '@modules/user/dto/user.dto';
import { User } from '@modules/user/schemas/user.schema';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotImplementedException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly imgUploadService: ImgUploadService,
  ) {}

  @UseGuards(LocalAuthGuard)
  //remove sensitive fields from UserDto
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @UseGuards(DoesUserExist)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Post('register')
  async register(@Body() user: CreateUserDto, @Req() req) {
    if (req.file) {
      try {
        const dataUri =
          'data:image/jpeg;base64,' + req.file?.buffer.toString('base64');
        const avatarURL: any = await this.imgUploadService.uploadAvatar(
          dataUri,
        );
        user.avatar = avatarURL.secure_url;
      } catch (error) {
        throw new NotImplementedException('Error while uploading avatar');
      }
    }
    const newUser = await this.authService.createUser(user);
    req.logIn(newUser, (err) => {
      if (err) {
        console.log(err);
        throw new InternalServerErrorException('Passport login error occured');
      }
    });
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get('google')
  async googleLogin(@Req() req) {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  redirect(@Res() res, @Req() req) {
    res.send('<script>window.close()</script>');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  async logout(@Req() req, @Res() res) {
    req.logOut();
    return res.json({ msg: 'logged out' });
  }
}
