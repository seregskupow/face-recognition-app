import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { chromiumProvider } from './providers/chromium.provider';
//import * as dotenv from 'dotenv';

//dotenv.config();

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [chromiumProvider],
  exports: [JwtModule, chromiumProvider],
})
export class GlobalModule {}
