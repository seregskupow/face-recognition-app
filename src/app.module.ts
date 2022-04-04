import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { GlobalModule } from '@core/globalModules/global.module';
import { ImgUploadModule } from '@core/imageUploader/img-upload.module';
import { FaceapiModule } from './modules/faceapi/faceapi.module';
import { ActorsModule } from './modules/actors/actors.module';
import { RecognitionModule } from './modules/recognition/recognition.module';
import { ExternalApisModule } from './modules/external-apis/external-apis.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    GlobalModule,
    ImgUploadModule,
    FaceapiModule,
    ActorsModule,
    //RecognitionModule,
    ExternalApisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
