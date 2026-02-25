"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProyectosService = class ProyectosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.project.findMany();
    }
    async findOne(id) {
        return this.prisma.project.findUnique({
            where: { id },
        });
    }
    async getPortalState(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { pages: true }
        });
        if (!project)
            return null;
        let pages = project.pages.map(page => ({
            id: page.id,
            name: page.name,
            title: page.title,
            path: page.slug === 'home' ? '/' : `/${page.slug}`,
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
                    path: "/",
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
            pages
        };
    }
    async savePortalState(id, portalState) {
        await this.prisma.project.update({
            where: { id },
            data: {
                name: portalState.name,
                slug: portalState.slug,
                settings: portalState.settings,
            }
        });
        for (const page of portalState.pages) {
            await this.prisma.page.upsert({
                where: { id: page.id },
                create: {
                    id: page.id,
                    name: page.title || 'Página Sin Nombre',
                    title: page.title || 'Nueva Página',
                    slug: page.path === '/' ? 'home' : (page.path || '').replace(/^\/+/, ''),
                    content: page.sections,
                    projectId: id,
                    isHomepage: page.meta?.isHomepage || false,
                    isPublished: page.meta?.isPublished || true,
                    showInNav: page.meta?.showInNav || true,
                    order: page.meta?.order || 0
                },
                update: {
                    name: page.title || 'Página Sin Nombre',
                    title: page.title || 'Página Actualizada',
                    slug: page.path === '/' ? 'home' : (page.path || '').replace(/^\/+/, ''),
                    content: page.sections,
                    isHomepage: page.meta?.isHomepage || false,
                    isPublished: page.meta?.isPublished || true,
                    showInNav: page.meta?.showInNav || true,
                    order: page.meta?.order || 0
                }
            });
        }
        return { success: true };
    }
    async create(data) {
        return this.prisma.project.create({
            data,
        });
    }
};
exports.ProyectosService = ProyectosService;
exports.ProyectosService = ProyectosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProyectosService);
//# sourceMappingURL=proyectos.service.js.map