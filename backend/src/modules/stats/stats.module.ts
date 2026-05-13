import { Module } from '@nestjs/common';
import { StandingsController } from './controllers/standings.controller';
import { ProtocolController } from './controllers/protocol.controller';
import { MatchController } from './controllers/match.controller';
import { StandingsService } from './services/standings.service';
import { ProtocolService } from './services/protocol.service';
import { MatchService } from './services/match.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [StandingsController, ProtocolController, MatchController],
  providers: [StandingsService, ProtocolService, MatchService],
  exports: [StandingsService, ProtocolService, MatchService],
})
export class StatsModule {}