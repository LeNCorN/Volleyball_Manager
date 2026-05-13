import { IsArray, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourtSettingsDto {
  @ApiProperty({ example: 3, minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  courtsCount: number;

  @ApiProperty({ example: ['Площадка 1', 'Площадка 2', 'Площадка 3'] })
  @IsArray()
  @IsString({ each: true })
  courtsNames: string[];
}