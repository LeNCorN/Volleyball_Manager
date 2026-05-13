import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { StatsModule } from './modules/stats/stats.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { DocumentModule } from './modules/document/document.module';
import { SeasonModule } from './modules/season/season.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    TournamentModule,
    StatsModule,
    RatingsModule,
    ScheduleModule,
    DocumentModule,
    SeasonModule,
  ],
})
export class AppModule {}