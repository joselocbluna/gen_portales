// packages/shared/types/auth.ts

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    isActive: boolean;
    lastLoginAt?: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Role {
    id: string;
    name: string;
    displayName: string;
    description?: string | null;
    permissions: Record<string, boolean>; // JSON structure
    isSystem: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CompanyUser {
    id: string;
    userId: string;
    companyId: string;
    roleId: string;
    isActive: boolean;
    joinedAt: Date | string;

    user?: User;
    role?: Role;
}

export interface ProjectUser {
    id: string;
    userId: string;
    projectId: string;
    canEdit: boolean;
    assignedAt: Date | string;

    user?: User;
}
