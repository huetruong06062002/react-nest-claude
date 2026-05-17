import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { comparePassword, hashPassword } from '../../shared/utils/hash.util';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RoleRepository } from './repositories/role.repository';
import { JwtPayload } from './types/jwt-payload.type';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const customerRole = await this.roleRepository.findByName('customer');
    const passwordHash = await hashPassword(dto.password);

    this.logger.log(`Registering user: ${dto.email}`);
    return this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: passwordHash,
      role: customerRole ?? undefined,
    });
  }

  async login(
    dto: LoginDto,
    meta: { ipAddress?: string; userAgent?: string },
  ): Promise<LoginResult & { refreshToken: string }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await comparePassword(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    this.logger.log(`User logged in: ${dto.email}`);

    const { accessToken, refreshToken } = await this.generateTokenPair(user, meta);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name ?? 'customer',
      },
    };
  }

  async refresh(
    rawRefreshToken: string,
    meta: { ipAddress?: string; userAgent?: string },
  ): Promise<LoginResult & { refreshToken: string }> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);

    const { accessToken, refreshToken } = await this.generateTokenPair(stored.user, meta);

    return {
      accessToken,
      refreshToken,
      user: {
        id: stored.user.id,
        email: stored.user.email,
        name: stored.user.name,
        role: stored.user.role?.name ?? 'customer',
      },
    };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);
    this.logger.log('User logged out');
  }

  async getMe(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException();

    this.logger.log(`Updating profile for user #${userId}`);
    return this.userRepository.save({ ...user, ...dto });
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmailWithPassword(
      (await this.userRepository.findById(userId))!.email,
    );
    if (!user) throw new UnauthorizedException();

    const match = await comparePassword(dto.currentPassword, user.password);
    if (!match) throw new BadRequestException('Current password is incorrect');

    const newHash = await hashPassword(dto.newPassword);
    await this.userRepository.save({ ...user, password: newHash });

    await this.refreshTokenRepository.revokeAllByUserId(userId);
    this.logger.log(`Password changed for user #${userId}`);
  }

  private async generateTokenPair(
    user: User,
    meta: { ipAddress?: string; userAgent?: string },
  ): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name ?? 'customer',
    };

    const accessToken = this.jwtService.sign(payload);

    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save({
      user,
      tokenHash,
      ipAddress: meta.ipAddress ?? null,
      userAgent: meta.userAgent ?? null,
      expiresAt,
      isRevoked: false,
    });

    void refreshExpiresIn;
    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
