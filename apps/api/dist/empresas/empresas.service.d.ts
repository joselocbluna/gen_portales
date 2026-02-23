import { PrismaService } from '../prisma/prisma.service';
export declare class EmpresasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        name: string;
        slug: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isRoot: boolean;
        isActive: boolean;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
