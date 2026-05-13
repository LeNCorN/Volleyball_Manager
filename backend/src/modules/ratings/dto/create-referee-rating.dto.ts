import { IsUUID, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefereeRatingDto {
  @ApiProperty({ description: 'ID судьи' })
  @IsUUID()
  @IsNotEmpty()
  refereeId: string;

  @ApiProperty({ minimum: 2, maximum: 5, description: 'Оценка судье (2-5)' })
  @IsInt()
  @Min(2)
  @Max(5)
  score: number;
}