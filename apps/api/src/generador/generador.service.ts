import { Injectable } from '@nestjs/common';
import { PortalState } from '@generador/shared';

@Injectable()
export class GeneradorService {
    private dummyState: PortalState | null = null;
}
