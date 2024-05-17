import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from "body-parser";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(bodyParser.urlencoded({extended:false}))
  app.useGlobalPipes(new ValidationPipe(
    {whitelist:true}
  ));
  app.useStaticAssets("src/uploads");
  await app.listen(4000);
}
bootstrap();
