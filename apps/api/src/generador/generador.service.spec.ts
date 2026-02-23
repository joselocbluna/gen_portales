import { Test, TestingModule } from '@nestjs/testing';
import { GeneradorService } from './generador.service';

describe('GeneradorService', () => {
  let service: GeneradorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneradorService],
    }).compile();

    service = module.get<GeneradorService>(GeneradorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
