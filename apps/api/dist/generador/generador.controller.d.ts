import { GeneradorService } from './generador.service';
export declare class GeneradorController {
    private readonly generadorService;
    constructor(generadorService: GeneradorService);
    buildPortal(body: any): Promise<{
        success: boolean;
        message: string;
        path: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        path?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
}
