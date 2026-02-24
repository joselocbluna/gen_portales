import { PortalState } from '@generador/shared';
import { PrismaService } from '../prisma/prisma.service';
export declare class GeneradorService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateAstroProject(portalData: PortalState): Promise<{
        message: string;
        downloadUrl?: string;
    }>;
    private writeBaseFiles;
    private generatePage;
    private parseSection;
    private parseComponent;
}
