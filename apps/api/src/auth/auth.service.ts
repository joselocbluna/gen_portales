import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: {
                    companyUsers: {
                        include: { role: true }
                    }
                }
            });

            if (user && await bcrypt.compare(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (e) {
            throw new UnauthorizedException(e.message || String(e));
        }
    }

    async login(user: any) {
        // Tomamos la primera empresa del usuario por ahora (simplificación)
        const companyUser = user.companyUsers?.[0];

        const payload = {
            email: user.email,
            sub: user.id,
            companyId: companyUser?.companyId,
            role: companyUser?.role?.name
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                companyId: companyUser?.companyId,
                role: companyUser?.role?.name
            }
        };
    }
}
