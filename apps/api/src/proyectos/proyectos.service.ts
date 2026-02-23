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

    async create(data: { name: string; slug: string; companyId: string }) {
        return this.prisma.project.create({
            data,
        });
    }
}
