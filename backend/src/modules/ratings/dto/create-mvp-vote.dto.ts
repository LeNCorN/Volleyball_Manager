import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMvpVoteDto {
  @ApiProperty({ description: 'ID игрока, выбранного MVP' })
  @IsUUID()
  @IsNotEmpty()
  mvpPlayerId: string;
}