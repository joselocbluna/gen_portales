import { Module } from '@nestjs/common';
import { GeneradorService } from './generador.service';
import { GeneradorController } from './generador.controller';

@Module({
  controllers: [GeneradorController],
  providers: [GeneradorService]
})
export class GeneradorModule { }
