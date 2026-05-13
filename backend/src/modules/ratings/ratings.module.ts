import { Module } from '@nestjs/common';
import { MvpController } from './controllers/mvp.controller';
import { RefereeController } from './controllers/referee.controller';
import { MvpService } from './services/mvp.service';
import { RefereeService } from './services/referee.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [MvpController, RefereeController],
  providers: [MvpService, RefereeService],
  exports: [MvpService, RefereeService],
})
export class RatingsModule {}