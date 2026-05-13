import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseSeasonDto {
  @ApiProperty({ required: false, default: true, description: 'Архивировать результаты' })
  @IsOptional()
  @IsBoolean()
  archiveResults?: boolean = true;
}