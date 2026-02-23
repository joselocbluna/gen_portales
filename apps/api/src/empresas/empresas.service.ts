import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresasService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.company.findMany();
    }

    async findOne(id: string) {
        return this.prisma.company.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string; slug: string }) {
        return this.prisma.company.create({
            data,
        });
    }
}
