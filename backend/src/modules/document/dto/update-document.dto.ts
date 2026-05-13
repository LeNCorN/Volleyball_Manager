import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentCategory } from './upload-document.dto';

export class UpdateDocumentDto {
  @ApiProperty({ required: false, description: 'Название документа' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, description: 'Описание документа' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: DocumentCategory, description: 'Категория документа' })
  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @ApiProperty({ required: false, description: 'Опубликован ли документ' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}