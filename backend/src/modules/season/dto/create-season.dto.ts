import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeasonDto {
  @ApiProperty({ example: 'Сезон 2026', description: 'Название сезона' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2026-09-01', description: 'Дата начала сезона' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-11-30', description: 'Дата окончания сезона' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ required: false, example: 10, description: 'Количество недель' })
  @IsOptional()
  @IsInt()
  @Min(1)
  weeksCount?: number;
}