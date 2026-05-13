import { Module } from '@nestjs/common';
import { SeasonController } from './controllers/season.controller';
import { ArchiveController } from './controllers/archive.controller';
import { SeasonService } from './services/season.service';
import { ArchiveService } from './services/archive.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [SeasonController, ArchiveController],
  providers: [SeasonService, ArchiveService],
  exports: [SeasonService, ArchiveService],
})
export class SeasonModule {}