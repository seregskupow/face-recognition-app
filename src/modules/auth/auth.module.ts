import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './utils/serialize';
import { UserModule } from '@modules/user/user.module';
import { ImgUploadModule } from '@core/imageUploader/img-upload.module';

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    UserModule,
    ImgUploadModule,
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
