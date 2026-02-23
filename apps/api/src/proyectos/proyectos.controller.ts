import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';

@Controller('proyectos')
export class ProyectosController {
    constructor(private readonly proyectosService: ProyectosService) { }

    @Get()
    findAll() {
        return this.proyectosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.proyectosService.findOne(id);
    }

    @Post()
    create(@Body() body: { name: string; slug: string; companyId: string }) {
        return this.proyectosService.create(body);
    }
}
