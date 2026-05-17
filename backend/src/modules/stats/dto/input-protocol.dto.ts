import { IsArray, IsUUID, IsInt, Min, Max, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SetScoreDto {
  @ApiProperty({ example: 25, description: 'Очки команды хозяев' })
  @IsNumber()
  @Min(0)
  @Max(99)
  homePoints: number;

  @ApiProperty({ example: 20, description: 'Очки команды гостей' })
  @IsNumber()
  @Min(0)
  @Max(99)
  awayPoints: number;
}

export class InputProtocolDto {
  @ApiProperty({ type: [SetScoreDto], description: 'Список сетов (3-5)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetScoreDto)
  sets: SetScoreDto[];

  @ApiProperty({ required: false, description: 'ID MVP игрока команды хозяев' })
  @IsOptional()
  @IsUUID()
  mvpHomeId?: string;

  @ApiProperty({ required: false, description: 'ID MVP игрока команды гостей' })
  @IsOptional()
  @IsUUID()
  mvpAwayId?: string;

  @ApiProperty({ required: false, minimum: 2, maximum: 5, description: 'Оценка судье от команды хозяев' })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(5)
  refereeRatingHome?: number;

  @ApiProperty({ required: false, minimum: 2, maximum: 5, description: 'Оценка судье от команды гостей' })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(5)
  refereeRatingAway?: number;
}