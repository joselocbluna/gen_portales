import { ProyectosService } from './proyectos.service';
export declare class ProyectosController {
    private readonly proyectosService;
    constructor(proyectosService: ProyectosService);
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
        globalStyles: import("@prisma/client/runtime/library").JsonValue | null;
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
        globalStyles: import("@prisma/client/runtime/library").JsonValue | null;
        publishedAt: Date | null;
    } | null>;
    getPortalState(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        settings: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        globalStyles: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        pages: {
            id: string;
            name: string;
            title: string;
            slug: string;
            description: string | null;
            layout: string;
            sections: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
            meta: {
                isHomepage: boolean;
                isPublished: boolean;
                showInNav: boolean;
                order: number;
            };
        }[];
    } | null>;
    savePortalState(id: string, state: any): Promise<{
        success: boolean;
    }>;
    create(body: {
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
        globalStyles: import("@prisma/client/runtime/library").JsonValue | null;
        publishedAt: Date | null;
    }>;
}
