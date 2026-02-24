import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (e) {
            console.warn('WARNING: Prisma falló al conectar. El API seguirá funcionando pero las rutas de BD fallarán.');
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
