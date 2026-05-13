import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto {
  @ApiProperty({ required: false, description: 'ФИО игрока' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, description: 'Дата рождения' })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ required: false, description: 'Рост в см' })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @ApiProperty({ required: false, enum: ['attacker', 'setter', 'libero', 'blocker'] })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ required: false, enum: ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus'] })
  @IsOptional()
  @IsString()
  skillLevel?: string;
}