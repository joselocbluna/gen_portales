import { Module } from '@nestjs/common';
import { GeneradorService } from './generador.service';

@Module({
  providers: [GeneradorService]
})
export class GeneradorModule {}
