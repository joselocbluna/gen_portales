"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorController = void 0;
const common_1 = require("@nestjs/common");
const generador_service_1 = require("./generador.service");
let GeneradorController = class GeneradorController {
    generadorService;
    constructor(generadorService) {
        this.generadorService = generadorService;
    }
    async buildPortal(body) {
        const portalState = body;
        if (!portalState || !portalState.pages) {
            return {
                success: false,
                message: 'El estado del portal enviado es inválido o está vacío.'
            };
        }
        return this.generadorService.generateAstroProject(portalState);
    }
};
exports.GeneradorController = GeneradorController;
__decorate([
    (0, common_1.Post)('build'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GeneradorController.prototype, "buildPortal", null);
exports.GeneradorController = GeneradorController = __decorate([
    (0, common_1.Controller)('generador'),
    __metadata("design:paramtypes", [generador_service_1.GeneradorService])
], GeneradorController);
//# sourceMappingURL=generador.controller.js.map