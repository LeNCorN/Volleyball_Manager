import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateScheduleDto {
  @ApiProperty({ required: false, default: false, description: 'Перезаписать существующее расписание' })
  @IsOptional()
  @IsBoolean()
  overwrite?: boolean = false;
}