import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Спартак', description: 'Название команды' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'hard', description: 'Дивизион (hard/light)' })
  @IsString()
  @IsNotEmpty()
  division: string;

  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО капитана' })
  @IsString()
  @IsNotEmpty()
  captainName: string;

  @ApiProperty({ required: false, description: 'URL эмблемы' })
  @IsOptional()
  @IsString()
  emblemUrl?: string;
}

export class UpdateTeamDto {
  @ApiProperty({ required: false, example: 'Спартак-2', description: 'Название команды' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'light', description: 'Дивизион' })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiProperty({ required: false, example: 'Петров Петр Петрович', description: 'ФИО капитана' })
  @IsOptional()
  @IsString()
  captainName?: string;

  @ApiProperty({ required: false, description: 'URL эмблемы' })
  @IsOptional()
  @IsString()
  emblemUrl?: string;

  @ApiProperty({ required: false, example: 'A', description: 'Группа (A/B)' })
  @IsOptional()
  @IsString()
  groupLetter?: string;

  @ApiProperty({ required: false, example: false, description: 'В листе ожидания' })
  @IsOptional()
  @IsBoolean()
  isWaiting?: boolean;
}