import { Module } from '@nestjs/common';
import { TeamController } from './controllers/team.controller';
import { PlayerController } from './controllers/player.controller';
import { ApplicationController } from './controllers/application.controller';
import { GroupController } from './controllers/group.controller';
import { TeamService } from './services/team.service';
import { PlayerService } from './services/player.service';
import { ApplicationService } from './services/application.service';
import { GroupService } from './services/group.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [
    TeamController,
    PlayerController,
    ApplicationController,
    GroupController,
  ],
  providers: [TeamService, PlayerService, ApplicationService, GroupService],
  exports: [TeamService, PlayerService, ApplicationService, GroupService],
})
export class TournamentModule {}