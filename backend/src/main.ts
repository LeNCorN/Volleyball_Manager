import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);

    // Глобальная валидация DTO
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,           // Удаляет поля, не указанные в DTO
            forbidNonWhitelisted: true, // Бросает ошибку при лишних полях
            transform: true,           // Автоматически преобразует типы
        }),
    );

    // Глобальные фильтры ошибок
    app.useGlobalFilters(new HttpExceptionFilter());

    // Глобальные интерцепторы
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Безопасность
    app.use(helmet());

    // CORS
    app.enableCors({
        origin: configService.get<string>('FRONTEND_URL', 'http://localhost:80'),
        credentials: true,
    });

    // Глобальный префикс API
    app.setGlobalPrefix('api');

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();