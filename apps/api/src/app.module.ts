import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresasModule } from './empresas/empresas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { GeneradorModule } from './generador/generador.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [PrismaModule, AuthModule, EmpresasModule, ProyectosModule, GeneradorModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
