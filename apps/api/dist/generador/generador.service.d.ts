import { PortalState } from '@generador/shared';
export declare class GeneradorService {
    private readonly logger;
    generateAstroProject(portalState: PortalState): Promise<{
        success: boolean;
        message: string;
        path: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        path?: undefined;
    }>;
    private writeBaseFiles;
    private generatePage;
    private parseSection;
    private parseComponent;
}
