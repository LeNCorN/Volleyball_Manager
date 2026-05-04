import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'test') {
            const tablenames = await this.$queryRaw<
                Array<{ tablename: string }>
            >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

            const tables = tablenames
                .map(({ tablename }) => tablename)
                .filter((name) => name !== '_prisma_migrations');

            for (const table of tables) {
                await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
            }
        }
    }
}