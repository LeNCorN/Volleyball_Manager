import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { TournamentSettingsController } from './controllers/tournament-settings.controller';
import { ScheduleService } from './services/schedule.service';
import { TournamentSettingsService } from './services/tournament-settings.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [ScheduleController, TournamentSettingsController],
  providers: [ScheduleService, TournamentSettingsService],
  exports: [ScheduleService, TournamentSettingsService],
})
export class ScheduleModule {}