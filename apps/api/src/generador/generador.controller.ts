import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { GeneradorService } from './generador.service';
import { PortalState } from '@generador/shared';
// Importamos JWT Guard si existe, de lo contrario lo omitiremos temporalmente
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('generador')
export class GeneradorController {
    constructor(private readonly generadorService: GeneradorService) { }

    @Post('build')
    @HttpCode(HttpStatus.OK)
    async buildPortal(@Body() body: any) {
        const portalState = body as PortalState;
        if (!portalState || !portalState.pages) {
            return {
                success: false,
                message: 'El estado del portal enviado es inválido o está vacío.'
            };
        }

        return this.generadorService.generateAstroProject(portalState);
    }
}
