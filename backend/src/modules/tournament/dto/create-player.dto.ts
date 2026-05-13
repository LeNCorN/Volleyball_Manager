import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО игрока' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '1995-05-15', description: 'Дата рождения (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 185, description: 'Рост в см (100-250)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(250)
  heightCm: number;

  @ApiProperty({ example: 'attacker', enum: ['attacker', 'setter', 'libero', 'blocker'] })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: 'light',
    enum: ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus']
  })
  @IsString()
  @IsNotEmpty()
  skillLevel: string;

  @ApiProperty({ required: false, description: 'ID команды' })
  @IsOptional()
  @IsUUID()
  teamId?: string;
}

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