"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando Seeding de Entidades Dummy para Gen Portales...');
    const company = await prisma.company.upsert({
        where: { id: 'company-dummy-1' },
        update: {},
        create: {
            id: 'company-dummy-1',
            name: 'Empresa Demo SA de CV',
            slug: 'empresa-demo',
        },
    });
    console.log(`✅ Empresa creada/verificada: ${company.name}`);
    const project = await prisma.project.upsert({
        where: { id: 'portal-1' },
        update: {},
        create: {
            id: 'portal-1',
            name: 'Portal Inmobiliario',
            slug: 'portal-1-demo',
            description: 'Portal de pruebas local',
            companyId: company.id,
            publishedAt: null,
        },
    });
    console.log(`✅ Proyecto (Portal) creado/verificado: ${project.name} | ID: ${project.id}`);
}
main()
    .catch((e) => {
    console.error('Error durante el seeder:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map