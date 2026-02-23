// packages/shared/types/empresa.ts

import { PortalState, GlobalStyles } from './canvas';

export interface Company {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    isRoot: boolean;
    isActive: boolean;
    settings?: Record<string, any> | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Project {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    status: ProjectStatus;
    companyId: string;
    templateId?: string | null;
    settings?: Record<string, any> | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    publishedAt?: Date | string | null;

    company?: Company;
}

export type TemplateScope = 'GLOBAL' | 'COMPANY';

export interface Template {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    thumbnail?: string | null;
    category?: string | null;
    tags: string[];
    scope: TemplateScope;
    companyId?: string | null;
    isActive: boolean;

    content: PortalState; // Canvas portal state
    globalStyles?: GlobalStyles | null;

    createdAt: Date | string;
    updatedAt: Date | string;

    company?: Company;
}

export type BuildStatus = 'PENDING' | 'BUILDING' | 'SUCCESS' | 'FAILED';

export interface Build {
    id: string;
    projectId: string;
    version: number;
    status: BuildStatus;
    outputPath?: string | null;
    buildLog?: string | null;
    duration?: number | null;
    triggeredBy?: string | null;
    createdAt: Date | string;
    completedAt?: Date | string | null;
}
