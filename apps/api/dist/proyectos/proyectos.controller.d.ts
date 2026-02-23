import { ProyectosService } from './proyectos.service';
export declare class ProyectosController {
    private readonly proyectosService;
    constructor(proyectosService: ProyectosService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    } | null>;
    create(body: {
        name: string;
        slug: string;
        companyId: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProjectStatus;
        companyId: string;
        templateId: string | null;
        publishedAt: Date | null;
    }>;
}
