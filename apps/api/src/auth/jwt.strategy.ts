import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // Aquí es importante: NEXTAUTH_SECRET es la clave firmante real
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.NEXTAUTH_SECRET || 'un_secreto_super_seguro_para_gen_portales_123',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, companyId: payload.companyId, role: payload.role };
    }
}
