import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Prisma conectado correctamente a:', process.env.DATABASE_URL?.split('@')[1] || process.env.DATABASE_URL);
        } catch (e) {
            console.error('❌ ERROR Prisma: Falla al conectar con base de datos.', e);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
