import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Глобальные фильтры и интерцепторы
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Безопасность
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Глобальный префикс API
  app.setGlobalPrefix('api');

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Волейбольный веб-сервис API')
    .setDescription('API для организации волейбольных чемпионатов')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Авторизация администратора')
    .addTag('Tournament', 'Управление командами и игроками')
    .addTag('Stats', 'Статистика и турнирные таблицы')
    .addTag('Ratings', 'Рейтинги MVP и судей')
    .addTag('Schedule', 'Расписание игр')
    .addTag('Documents', 'Управление документами')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();