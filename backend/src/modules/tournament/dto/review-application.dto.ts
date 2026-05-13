import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewApplicationDto {
  @ApiProperty({ example: 'approved', enum: ['approved', 'rejected'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['approved', 'rejected'])
  status: string;

  @ApiProperty({ required: false, example: 'Не соответствует требованиям лиги' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}