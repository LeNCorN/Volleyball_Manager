import { IsString, IsNumber, IsNotEmpty, IsEmail, IsArray, ValidateNested, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerInApplicationDto {
  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО игрока' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '1995-05-15', description: 'Дата рождения' })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 185, description: 'Рост в см' })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(250)
  heightCm: number;

  @ApiProperty({ example: 'attacker', enum: ['attacker', 'setter', 'libero', 'blocker'] })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ example: 'light', enum: ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus'] })
  @IsString()
  @IsNotEmpty()
  skillLevel: string;
}

export class CreateApplicationDto {
  @ApiProperty({ example: 'Спартак', description: 'Название команды' })
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @ApiProperty({ example: 'light', enum: ['hard', 'light'] })
  @IsString()
  @IsNotEmpty()
  division: string;

  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО капитана' })
  @IsString()
  @IsNotEmpty()
  captainName: string;

  @ApiProperty({ example: '+7 (999) 123-45-67', description: 'Телефон капитана' })
  @IsString()
  @IsNotEmpty()
  captainPhone: string;

  @ApiProperty({ example: 'captain@spartak.ru', description: 'Email капитана' })
  @IsEmail()
  @IsNotEmpty()
  captainEmail: string;

  @ApiProperty({ type: [CreatePlayerInApplicationDto], description: 'Список игроков (максимум 14)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerInApplicationDto)
  players: CreatePlayerInApplicationDto[];

  @ApiProperty({ required: false, description: 'URL эмблемы' })
  @IsOptional()
  @IsString()
  emblemUrl?: string;
}