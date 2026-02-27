"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeneradorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const prisma_service_1 = require("../prisma/prisma.service");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let GeneradorService = GeneradorService_1 = class GeneradorService {
    prisma;
    logger = new common_1.Logger(GeneradorService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateAstroProject(portalData) {
        this.logger.log(`Generando proyecto Astro para portal: ${portalData.id}`);
        try {
            this.logger.log(`Sincronizando estado del portal ${portalData.id} a la Base de Datos...`);
            for (const p of portalData.pages) {
                const page = p;
                await this.prisma.page.upsert({
                    where: { id: page.id },
                    create: {
                        id: page.id,
                        name: page.title || 'Página Sin Nombre',
                        title: page.title || 'Nueva Página',
                        slug: page.slug === 'home' || page.slug === '/' ? 'home' : (page.slug || '').replace(/^\/+/, ''),
                        content: page.sections,
                        projectId: portalData.id
                    },
                    update: {
                        name: page.title || 'Página Sin Nombre',
                        title: page.title || 'Página Actualizada',
                        slug: page.slug === 'home' || page.slug === '/' ? 'home' : (page.slug || '').replace(/^\/+/, ''),
                        content: page.sections,
                    }
                });
            }
            this.logger.log(`✅ ${portalData.pages.length} página(s) sincronizada(s) con éxito en la Base de Datos.`);
        }
        catch (dbError) {
            this.logger.error('Error al sincronizar con la base de datos:', dbError);
        }
        const timestamp = Date.now();
        const outputDir = path.join(process.cwd(), 'temp', `astro-project-${timestamp}`);
        try {
            await fs.mkdir(path.join(outputDir, 'src', 'pages'), { recursive: true });
            await this.writeBaseFiles(outputDir);
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
            };
        }
        catch (error) {
            this.logger.error(`Error durante la generación de Astro: ${error}`);
            return {
                message: `Error al generar el portal: ${String(error)}`
            };
        }
    }
    async writeBaseFiles(baseDir) {
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
    async generatePage(baseDir, page, portalData) {
        const bgBody = portalData.globalStyles?.bodyBackground || '#ffffff';
        const colorBody = portalData.settings?.colorPalette?.text || '#333333';
        let layoutClass = 'container';
        let sidebarHtml = '';
        if (page.layout === 'fullwidth') {
            layoutClass = 'fullwidth';
        }
        else if (page.layout === 'sidebar') {
            layoutClass = 'with-sidebar';
            sidebarHtml = `
      <aside class="sidebar">
        <h3>Menú</h3>
        <ul>
          <li><a href="#">Opción 1</a></li>
          <li><a href="#">Opción 2</a></li>
          <li><a href="#">Opción 3</a></li>
        </ul>
      </aside>`;
        }
        let htmlContent = `<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${page.title} - ${portalData.name}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 0; background: ${bgBody}; color: ${colorBody}; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .fullwidth { width: 100%; padding: 0; }
    .with-sidebar { display: grid; grid-template-columns: 250px 1fr; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
    .sidebar { background: #f8fafc; padding: 2rem; border-right: 1px solid #e2e8f0; }
    .sidebar ul { list-style: none; padding: 0; }
    .sidebar li { margin-bottom: 0.5rem; }
    .sidebar a { color: #334155; text-decoration: none; }
    .main-content { padding: 2rem; width: 100%; box-sizing: border-box; }
    .grid { display: grid; gap: 1rem; width: 100%; margin-top: 1rem; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #eaeaea; border-radius: 6px; background: white; }
    .column { display: flex; flex-direction: column; gap: 1rem; min-height: 50px; }
    .form-control { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  </style>
</head>
<body>
  <div class="${layoutClass}">
${sidebarHtml}
    <main class="main-content">
`;
        for (const section of page.sections) {
            htmlContent += this.parseSection(section);
        }
        htmlContent += `    </main>\n  </div>\n</body>\n</html>`;
        const fileContent = `---
// Archivo autogenerado para Astro (Motor de Gen Portales)
// Aquí podríamos importar componentes interactivos luego
---
${htmlContent}
`;
        const pagePath = page.slug === '/' ? 'index' : (page.slug || '').replace(/^\/+/, '');
        const fileName = pagePath || 'index';
        await fs.writeFile(path.join(baseDir, 'src', 'pages', `${fileName}.astro`), fileContent);
    }
    parseSection(section) {
        let colsClass = 'grid-cols-1';
        if (section.columns && section.columns > 1 && section.columns <= 4) {
            colsClass = `grid-cols-${section.columns}`;
        }
        const sectionStyles = section.styles || {};
        const inlineStyle = [
            sectionStyles.backgroundColor ? `background-color: ${sectionStyles.backgroundColor};` : '',
            sectionStyles.backgroundImage ? `background-image: url('${sectionStyles.backgroundImage}'); background-size: cover; background-position: center;` : '',
            sectionStyles.padding?.top ? `padding-top: ${sectionStyles.padding.top};` : '',
            sectionStyles.padding?.bottom ? `padding-bottom: ${sectionStyles.padding.bottom};` : '',
            sectionStyles.margin?.top ? `margin-top: ${sectionStyles.margin.top};` : '',
            sectionStyles.margin?.bottom ? `margin-bottom: ${sectionStyles.margin.bottom};` : '',
        ].filter(Boolean).join(' ');
        let sectionHtml = `    <section class="section" id="${section.id}" ${inlineStyle ? `style="${inlineStyle}"` : ''}>\n`;
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
    parseComponent(comp) {
        const styleStr = this.buildStyleString(comp.styles);
        const wrapperStyle = comp.styles?.backgroundColor ? ` style="background-color: ${comp.styles.backgroundColor};"` : '';
        let innerHtml = '';
        switch (comp.type) {
            case 'heading':
                innerHtml = `          <h2 style="${styleStr}">${comp.props.text || 'Sin texto'}</h2>\n`;
                break;
            case 'paragraph':
                innerHtml = `          <p style="${styleStr}">${comp.props.text || 'Sin texto'}</p>\n`;
                break;
            case 'button':
                const btnFontSize = comp.styles?.fontSize ? `font-size: ${comp.styles.fontSize};` : '';
                const { actionType, actionTarget, text } = comp.props;
                const btnContent = text || 'Botón';
                const btnStyles = `padding: 10px 20px; background-color: #0ea5e9; color: white; font-weight: 500; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; display: inline-block; ${btnFontSize}`;
                if (actionType === 'link' && actionTarget) {
                    innerHtml = `          <div style="${styleStr}"><a href="${actionTarget}" style="${btnStyles}">${btnContent}</a></div>\n`;
                }
                else if (actionType === 'scroll' && actionTarget) {
                    innerHtml = `          <div style="${styleStr}"><a href="${actionTarget.startsWith('#') ? actionTarget : '#' + actionTarget}" style="${btnStyles}">${btnContent}</a></div>\n`;
                }
                else if (actionType === 'modal' && actionTarget) {
                    innerHtml = `          <div style="${styleStr}"><button onclick="document.getElementById('${actionTarget}').showModal()" style="${btnStyles}">${btnContent}</button></div>\n`;
                }
                else {
                    if (comp.props?.url) {
                        innerHtml = `          <div style="${styleStr}"><a href="${comp.props.url}" style="${btnStyles}">${btnContent}</a></div>\n`;
                    }
                    else {
                        innerHtml = `          <div style="${styleStr}"><button style="${btnStyles}">${btnContent}</button></div>\n`;
                    }
                }
                break;
            case 'navigation':
                const links = comp.props.links ? comp.props.links.split('\\n').map((l) => l.split(',')) : [];
                let linksHtml = '';
                for (const [text, url] of links) {
                    linksHtml += `<a href="${url || '#'}" style="text-decoration: none; color: inherit; font-weight: 500;">${text || 'Link'}</a>`;
                }
                innerHtml = `          <nav style="display: flex; gap: 1rem; flex-wrap: wrap; width: 100%; ${styleStr}">
            ${linksHtml}
          </nav>\n`;
                break;
            case 'image':
                innerHtml = `          <div style="${styleStr}"><img src="${comp.props.src || 'https://via.placeholder.com/600x400'}" alt="${comp.props.alt || ''}" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>\n`;
                break;
            case 'video':
                innerHtml = `          <iframe width="100%" height="315" src="${comp.props.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>\n`;
                break;
            case 'html':
                innerHtml = `          <div class="custom-html-wrapper">\n            ${comp.props.html || '<!-- Empty HTML block -->'}\n          </div>\n`;
                break;
            case 'gallery':
                const galleryCols = comp.props.columns || 3;
                const imagesStr = comp.props.images || '';
                const images = imagesStr ? imagesStr.split(',') : [];
                let galleryInner = '';
                for (const img of images) {
                    galleryInner += `\n            <div style="aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #eee;"><img src="${img.trim()}" style="width: 100%; height: 100%; object-fit: cover; display: block;" /></div>`;
                }
                innerHtml = `          <div style="display: grid; grid-template-columns: repeat(${galleryCols}, 1fr); gap: 1rem; ${styleStr}">${galleryInner}\n          </div>\n`;
                break;
            case 'form':
                innerHtml = `          <div style="background: white; padding: 2rem; border-radius: 8px; border: 1px solid #eee; ${styleStr}">
            <form action="mailto:${comp.props.emailTo || ''}" method="POST" enctype="text/plain">
              <input type="text" name="name" placeholder="Nombre completo" class="form-control" required />
              <input type="email" name="email" placeholder="Correo electrónico" class="form-control" required />
              <textarea name="message" placeholder="Mensaje" rows="4" class="form-control" required></textarea>
              <button type="submit" style="padding: 10px 20px; background-color: #0ea5e9; color: white; font-weight: 500; border: none; border-radius: 6px; cursor: pointer;">${comp.props.buttonText || 'Enviar'}</button>
            </form>
          </div>\n`;
                break;
            default:
                innerHtml = `          <!-- Tipo base no reconocido en el parser: ${comp.type} -->\n`;
        }
        if (wrapperStyle) {
            return `          <div${wrapperStyle}>\n${innerHtml}          </div>\n`;
        }
        return innerHtml;
    }
    buildStyleString(styles) {
        if (!styles)
            return '';
        let str = '';
        if (styles.color)
            str += `color: ${styles.color}; `;
        if (styles.textAlign)
            str += `text-align: ${styles.textAlign}; `;
        if (styles.fontSize)
            str += `font-size: ${styles.fontSize}; `;
        return str.trim();
    }
};
exports.GeneradorService = GeneradorService;
exports.GeneradorService = GeneradorService = GeneradorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeneradorService);
//# sourceMappingURL=generador.service.js.map