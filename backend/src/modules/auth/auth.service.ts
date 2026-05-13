import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AUTH_ERRORS, AUTH_CONSTANTS } from './constants/auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    try {
      const admin = await this.prisma.adminUser.findUnique({ where: { username } });
      if (!admin) {
        this.logger.warn(`Login attempt with non-existent admin: ${username}`);
        throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
      }
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isPasswordValid) {
        this.logger.warn(`Login attempt with invalid password for admin: ${username}`);
        throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
      }
      const { passwordHash: _, ...result } = admin;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error(`Error validating admin: ${error.message}`);
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
  }

  async login(admin: any) {
    const payload = { sub: admin.id, username: admin.username, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
      username: admin.username,
      role: 'admin',
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') throw new UnauthorizedException(AUTH_ERRORS.TOKEN_EXPIRED);
      throw new UnauthorizedException(AUTH_ERRORS.TOKEN_INVALID);
    }
  }

  async getAdminProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { id: true, username: true, createdAt: true },
    });
    if (!admin) throw new UnauthorizedException(AUTH_ERRORS.USER_NOT_FOUND);
    return admin;
  }

  async ensureAdminExists() {
    const defaultUsername = this.configService.get<string>(
      AUTH_CONSTANTS.ADMIN_USERNAME_KEY,
      AUTH_CONSTANTS.DEFAULT_ADMIN_USERNAME,
    );
    const defaultPassword = this.configService.get<string>(
      AUTH_CONSTANTS.ADMIN_PASSWORD_KEY,
      AUTH_CONSTANTS.DEFAULT_ADMIN_PASSWORD,
    );
    const existingAdmin = await this.prisma.adminUser.findUnique({ where: { username: defaultUsername } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await this.prisma.adminUser.create({
        data: { username: defaultUsername, passwordHash: hashedPassword },
      });
      this.logger.log(`Default admin created: ${defaultUsername}`);
    }
  }
}