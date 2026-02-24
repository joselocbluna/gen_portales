import { GeneradorService } from './generador.service';
export declare class GeneradorController {
    private readonly generadorService;
    constructor(generadorService: GeneradorService);
    buildPortal(body: any): Promise<{
        message: string;
        downloadUrl?: string;
    } | {
        success: boolean;
        message: string;
    }>;
}
