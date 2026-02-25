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

    @Get(':id/state')
    getPortalState(@Param('id') id: string) {
        return this.proyectosService.getPortalState(id);
    }

    @Post(':id/state')
    savePortalState(@Param('id') id: string, @Body() state: any) {
        return this.proyectosService.savePortalState(id, state);
    }

    @Post()
    create(@Body() body: { name: string; slug: string; companyId: string }) {
        return this.proyectosService.create(body);
    }
}
