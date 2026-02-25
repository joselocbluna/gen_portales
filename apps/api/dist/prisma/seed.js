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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
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
//# sourceMappingURL=seed.js.map