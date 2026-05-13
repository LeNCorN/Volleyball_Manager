import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerSkillDto {
  @ApiProperty({
    example: 'hard',
    enum: ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus'],
    description: 'Новый уровень мастерства игрока'
  })
  @IsString()
  @IsNotEmpty()
  skillLevel: string;
}