import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserHistoryService } from './services/user-history.service';
import { UserHistory, UserHistorySchema } from './schemas/user-history.schema';
import { UserRepository } from './repositories/user.repository';
import { UserHistoryRepository } from './repositories/user-history.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ImgUploadModule } from '@core/imageUploader/img-upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserHistory.name, schema: UserHistorySchema },
    ]),
    MulterModule.register({
      dest: './uploadFiles',
    }),
    ImgUploadModule,
  ],
  providers: [
    UserService,
    UserHistoryService,
    UserRepository,
    UserHistoryRepository,
  ],
  controllers: [UserController],
  exports: [UserService, UserHistoryService],
})
export class UserModule {}
