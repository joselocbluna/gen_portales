import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService) { }

    @Get()
    findAll() {
        return this.empresasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.empresasService.findOne(id);
    }

    @Post()
    create(@Body() body: { name: string; slug: string }) {
        return this.empresasService.create(body);
    }
}
