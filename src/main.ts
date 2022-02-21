import * as dotenv from 'dotenv';
dotenv.config();
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
import * as passport from 'passport';
import { urlencoded, json } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from '@core/pipes/validate.pipe';
import { BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoStore = require('connect-mongo');

mongoose.set('debug', true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidateInputPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL_DEV }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(morgan('tiny'));
  await app.listen(1337);
}
bootstrap();
