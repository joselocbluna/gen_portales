import { PrismaService } from '../prisma/prisma.service';
export declare class EmpresasService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: {
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
