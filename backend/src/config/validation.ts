import { plainToClass } from 'class-transformer';
import { IsString, IsNumber, IsOptional, Min, Max, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV: string = 'development';

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  MINIO_ENDPOINT: string = 'localhost:9000';

  @IsString()
  MINIO_ACCESS_KEY: string = 'minioadmin';

  @IsString()
  MINIO_SECRET_KEY: string = 'minioadmin123';

  @IsString()
  MINIO_BUCKET: string = 'volleyball';

  @IsString()
  ADMIN_USERNAME: string = 'admin';

  @IsString()
  ADMIN_PASSWORD: string = 'admin123';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}

// Этот объект нужен для ConfigModule.forRoot()
export const validationSchema = {
  validate: (config: Record<string, unknown>) => validate(config),
};