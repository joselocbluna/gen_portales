import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProyectosService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.project.findMany();
    }

    async findOne(id: string) {
        return this.prisma.project.findUnique({
            where: { id },
        });
    }

    async getPortalState(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { pages: true }
        });

        if (!project) return null;

        let pages = project.pages.map(page => ({
            id: page.id,
            name: page.name,
            title: page.title,
            slug: page.slug === 'home' ? '/' : `/${page.slug}`,
            description: page.description,
            layout: page.layout,
            sections: page.content || [],
            meta: {
                isHomepage: page.isHomepage,
                isPublished: page.isPublished,
                showInNav: page.showInNav,
                order: page.order
            }
        }));

        if (pages.length === 0) {
            pages = [{
                id: `page-${Date.now()}`,
                name: "Inicio",
                title: "Página de Inicio",
                slug: "/",
                description: "Página principal",
                layout: "default",
                sections: [],
                meta: { isHomepage: true, isPublished: true, showInNav: true, order: 0 }
            }];
        }

        return {
            id: project.id,
            name: project.name,
            slug: project.slug,
            settings: project.settings || { language: "es" },
            globalStyles: project.globalStyles || { bodyBackground: "#ffffff", defaultFont: "Inter", headingFont: "Inter", linkColor: "#2563eb" },
            pages
        };
    }

    async savePortalState(id: string, portalState: any) {
        // Save project settings
        await this.prisma.project.update({
            where: { id },
            data: {
                name: portalState.name,
                slug: portalState.slug,
                settings: portalState.settings,
                globalStyles: portalState.globalStyles,
            }
        });

        // Upsert pages
        for (const page of portalState.pages) {
            await this.prisma.page.upsert({
                where: { id: page.id },
                create: {
                    id: page.id,
                    name: page.title || 'Página Sin Nombre',
                    title: page.title || 'Nueva Página',
                    slug: page.slug === '/' ? 'home' : (page.slug || '').replace(/^\/+/, ''),
                    content: page.sections as any,
                    projectId: id,
                    isHomepage: page.meta?.isHomepage || false,
                    isPublished: page.meta?.isPublished || true,
                    showInNav: page.meta?.showInNav || true,
                    order: page.meta?.order || 0
                },
                update: {
                    name: page.title || 'Página Sin Nombre',
                    title: page.title || 'Página Actualizada',
                    slug: page.slug === '/' ? 'home' : (page.slug || '').replace(/^\/+/, ''),
                    content: page.sections as any,
                    isHomepage: page.meta?.isHomepage || false,
                    isPublished: page.meta?.isPublished || true,
                    showInNav: page.meta?.showInNav || true,
                    order: page.meta?.order || 0
                }
            });
        }
        return { success: true };
    }

    async create(data: { name: string; slug: string; companyId: string }) {
        return this.prisma.project.create({
            data,
        });
    }
}
