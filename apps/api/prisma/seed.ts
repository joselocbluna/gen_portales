import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando Seeding de Entidades Dummy para Gen Portales...');

    // 1. Crear Tenant/Empresa
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

    // 2. Crear Proyecto (Portal-1) asociado a esa empresa
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

    // 3. Crear Role
    const role = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            id: 'role-admin-1',
            name: 'admin',
            displayName: 'Administrador',
            permissions: {},
            isSystem: true,
        },
    });

    console.log(`✅ Rol creado/verificado: ${role.name}`);

    // 4. Crear Usuario
    const hashedPassword = await bcrypt.hash('admin', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@empresa.com' },
        update: {},
        create: {
            id: 'user-1',
            email: 'admin@empresa.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Empresa Demo',
        },
    });

    // Vincular Usuario con Empresa
    await prisma.companyUser.upsert({
        where: { userId_companyId: { userId: user.id, companyId: company.id } },
        update: {},
        create: {
            userId: user.id,
            companyId: company.id,
            roleId: role.id,
        },
    });

    console.log(`✅ Usuario creado/verificado: ${user.email}`);

}

main()
    .catch((e) => {
        console.error('Error durante el seeder:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
