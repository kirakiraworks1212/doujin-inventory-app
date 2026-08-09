import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // フロントエンド(Next.js)からのアクセスを許可する
  app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://doujin-inventory-app-production.up.railway.app',
    'https://heartfelt-insight-production-29c3.up.railway.app',
  ],
});
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();