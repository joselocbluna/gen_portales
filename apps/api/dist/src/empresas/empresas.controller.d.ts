import { EmpresasService } from './empresas.service';
export declare class EmpresasController {
    private readonly empresasService;
    constructor(empresasService: EmpresasService);
    findAll(): Promise<{
        id: string;
        slug: string;
        name: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(body: {
        name: string;
        slug: string;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
