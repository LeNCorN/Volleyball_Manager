import { IsString, IsOptional, IsArray, IsDateString, IsInt, Min, Max, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTournamentSettingsDto {
  @ApiProperty({ required: false, example: 'Чемпионат по волейболу 2026' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: '2026-09-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, example: '2026-11-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, example: ['monday', 'wednesday', 'friday', 'saturday'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  playDays?: string[];

  @ApiProperty({ required: false, example: 4, minimum: 1, description: 'Количество площадок (минимум 1)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  courtsCount?: number;

  @ApiProperty({ required: false, example: ['Площадка 1', 'Площадка 2', 'Площадка 3', 'Площадка 4'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courtsNames?: string[];

  @ApiProperty({ required: false, example: ['10:00', '12:00', '14:00', '16:00', '18:00'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  timeSlots?: string[];

  @ApiProperty({ required: false, example: 90, minimum: 30, maximum: 180, description: 'Длительность матча в минутах' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(180)
  matchDurationMinutes?: number;

  @ApiProperty({ required: false, example: '09:00', description: 'Время начала игрового дня (формат HH:MM)' })
  @IsOptional()
  @IsString()
  dayStartTime?: string;

  @ApiProperty({ required: false, example: '22:00', description: 'Время окончания игрового дня (формат HH:MM)' })
  @IsOptional()
  @IsString()
  dayEndTime?: string;
}