import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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