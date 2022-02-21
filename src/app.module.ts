import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { GlobalModule } from '@core/globalModules/global.module';
import { ImgUploadModule } from '@core/imageUploader/img-upload.module';
import { FaceapiModule } from './modules/faceapi/faceapi.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    GlobalModule,
    ImgUploadModule,
    FaceapiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
