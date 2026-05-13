import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigureGroupsDto {
  @ApiProperty({ example: 2, description: 'Количество групп в дивизионе (1 или 2)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(2)
  groupsCount: number;
}