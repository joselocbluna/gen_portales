import { PrismaService } from '../prisma/prisma.service';
export declare class ProyectosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    } | null>;
    create(data: {
        name: string;
        slug: string;
        companyId: string;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    }>;
}
