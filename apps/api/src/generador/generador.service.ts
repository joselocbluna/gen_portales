import { Injectable, Logger } from '@nestjs/common';
import { PortalState, Page, Section, Component } from '@generador/shared';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';

const execAsync = promisify(exec);

@Injectable()
export class GeneradorService {
    private readonly logger = new Logger(GeneradorService.name);

    constructor(private readonly prisma: PrismaService) { }

    async generateAstroProject(portalData: PortalState): Promise<{ message: string; downloadUrl?: string }> {
        this.logger.log(`Generando proyecto Astro para portal: ${portalData.id}`);

        // --- FASE 1.5: Sincronización con Base de Datos ---
        try {
            this.logger.log(`Sincronizando estado del portal ${portalData.id} a la Base de Datos...`);
            for (const p of portalData.pages) {
                const page = p as any; // Evadir conflicto de Typescript temporal: Page de UI vs Page de Prisma
                // En PostgreSQL un 'Page' pertenece a un 'Project'
                await this.prisma.page.upsert({
                    where: { id: page.id },
                    create: {
                        id: page.id,
                        name: page.title || 'Página Sin Nombre',
                        title: page.title || 'Nueva Página',
                        slug: page.path === '/' ? 'home' : (page.path || '').replace(/^\/+/, ''),
                        content: page.sections as any, // Guardamos el arbol JSON
                        projectId: portalData.id // Asumimos portalData.id == projectId
                    },
                    update: {
                        name: page.title || 'Página Sin Nombre',
                        title: page.title || 'Página Actualizada',
                        slug: page.path === '/' ? 'home' : (page.path || '').replace(/^\/+/, ''),
                        content: page.sections as any,
                    }
                });
            }
            this.logger.log(`✅ ${portalData.pages.length} página(s) sincronizada(s) con éxito en la Base de Datos.`);
        } catch (dbError) {
            this.logger.error('Error al sincronizar con la base de datos:', dbError);
            // Podríamos abortar aquí, pero continuaremos con la generación física como degradación amable
        }

        // Directorio de salida temporal
        const timestamp = Date.now();
        const outputDir = path.join(process.cwd(), 'temp', `astro-project-${timestamp}`);

        try {
            // 1. Crear directorios
            await fs.mkdir(path.join(outputDir, 'src', 'pages'), { recursive: true });

            // 2. Escribir archivos base de configuración de Astro
            await this.writeBaseFiles(outputDir);

            // 3. Escribir cada página del portal
            for (const page of portalData.pages) {
                await this.generatePage(outputDir, page, portalData);
            }

            this.logger.log(`Archivos Astro generados con éxito en la ruta temporal: ${outputDir}`);

            this.logger.log(`Instalando dependencias de Astro en: ${outputDir}... (ESTO PUEDE TARDAR)`);
            await execAsync('npm install', { cwd: outputDir });

            this.logger.log(`Construyendo sitio Astro...`);
            await execAsync('npm run build', { cwd: outputDir });

            this.logger.log(`Sitio estático generado exitosamente en: ${path.join(outputDir, 'dist')}`);

            return {
                message: 'Portal generado exitosamente.',
                path: path.join(outputDir, 'dist')
            } as any; // Cast a Any porque el controller consume más de lo que marca la Interface en Promise temporalmente
        } catch (error) {
            this.logger.error(`Error durante la generación de Astro: ${error}`);
            return {
                message: `Error al generar el portal: ${String(error)}`
            } as any;
        }
    }

    private async writeBaseFiles(baseDir: string) {
        const packageJson = {
            name: "gen-portal-output",
            type: "module",
            version: "0.0.1",
            scripts: {
                dev: "astro dev",
                build: "ASTRO_TELEMETRY_DISABLED=1 CI=true astro build",
                preview: "astro preview",
                astro: "astro"
            },
            dependencies: {
                astro: "^4.0.0"
            }
        };

        const astroConfig = `
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
`;

        await fs.writeFile(path.join(baseDir, 'package.json'), JSON.stringify(packageJson, null, 2));
        await fs.writeFile(path.join(baseDir, 'astro.config.mjs'), astroConfig.trim());
    }

    private async generatePage(baseDir: string, page: Page, portalState: PortalState) {
        // En Astro todo lo que no sea script va en el cuerpo, usaremos layout HTML estándar por simplicidad base
        let htmlContent = `<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${page.title} - ${portalState.name}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 0; background: #fafafa; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .grid { display: grid; gap: 1rem; w-full; margin-top: 1rem; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #eaeaea; border-radius: 6px; background: white; }
    .column { display: flex; flex-direction: column; gap: 1rem; min-height: 50px; }
  </style>
</head>
<body>
  <div class="container">
`;

        // Render sections recursivamente
        for (const section of page.sections) {
            htmlContent += this.parseSection(section);
        }

        htmlContent += `  </div>\n</body>\n</html>`;

        const fileContent = `---
// Archivo autogenerado para Astro (Motor de Gen Portales)
// Aquí podríamos importar componentes interactivos luego
---
${htmlContent}
`;

        const pageSlug = page.slug === '/' ? 'index' : page.slug.replace(/^\/+/, '');
        const fileName = pageSlug || 'index';

        await fs.writeFile(path.join(baseDir, 'src', 'pages', `${fileName}.astro`), fileContent);
    }

    private parseSection(section: Section): string {
        let colsClass = 'grid-cols-1';
        if (section.columns && section.columns > 1 && section.columns <= 4) {
            colsClass = `grid-cols-${section.columns}`;
        }

        let sectionHtml = `    <section class="section" id="${section.id}">\n`;
        sectionHtml += `      <div class="grid ${colsClass}">\n`;

        const numCols = section.columns || 1;
        for (let i = 0; i < numCols; i++) {
            const columnComponents = section.components.filter(c => (c.column === undefined ? 0 : c.column) === i);
            sectionHtml += `        <div class="column">\n`;
            for (const comp of columnComponents) {
                sectionHtml += this.parseComponent(comp);
            }
            sectionHtml += `        </div>\n`;
        }

        sectionHtml += `      </div>\n    </section>\n`;
        return sectionHtml;
    }

    private parseComponent(comp: Component): string {
        switch (comp.type) {
            case 'heading':
                return `          <h2>${comp.props.text || 'Sin texto'}</h2>\n`;
            case 'paragraph':
                return `          <p>${comp.props.text || 'Sin texto'}</p>\n`;
            case 'button':
                return `          <button style="padding: 10px 20px; background-color: #0ea5e9; color: white; font-weight: 500; border: none; border-radius: 6px; cursor: pointer;">${comp.props.text || 'Botón'}</button>\n`;
            case 'image':
                return `          <img src="${comp.props.src || 'https://via.placeholder.com/600x400'}" alt="${comp.props.alt || ''}" style="max-width: 100%; height: auto; border-radius: 8px;" />\n`;
            default:
                return `          <!-- Tipo base no reconocido en el parser: ${comp.type} -->\n`;
        }
    }
}
