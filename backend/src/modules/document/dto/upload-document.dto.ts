import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DocumentCategory {
  REGULATIONS = 'regulations',
  VOLLEYBALL_RULES = 'volleyball_rules',
  REFEREE_RULES = 'referee_rules',
  OTHER = 'other',
}

export class UploadDocumentDto {
  @ApiProperty({ example: 'Регламент чемпионата 2026', description: 'Название документа' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Полные правила проведения турнира', description: 'Описание документа' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DocumentCategory, example: 'regulations', description: 'Категория документа' })
  @IsEnum(DocumentCategory)
  @IsNotEmpty()
  category: DocumentCategory;
}