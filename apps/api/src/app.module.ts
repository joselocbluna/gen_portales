import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresasModule } from './empresas/empresas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { GeneradorModule } from './generador/generador.module';

@Module({
  imports: [PrismaModule, EmpresasModule, ProyectosModule, GeneradorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
