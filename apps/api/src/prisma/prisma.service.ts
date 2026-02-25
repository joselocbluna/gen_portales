import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const url = process.env.DATABASE_URL?.includes('dummy')
            ? 'postgresql://postgres:password@localhost:5432/gen_portales?schema=public'
            : process.env.DATABASE_URL;

        super({
            datasources: {
                db: {
                    url,
                },
            },
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Prisma conectado correctamente.');
        } catch (e) {
            console.error('❌ ERROR Prisma: Falla al conectar con base de datos.', e);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
