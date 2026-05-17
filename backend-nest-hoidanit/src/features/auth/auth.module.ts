import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleController } from './controllers/role.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { Role } from './entities/role.entity';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: (config.get('jwt.expiresIn') ?? '15m') as unknown as number },
      }),
    }),
    TypeOrmModule.forFeature([Role, User, RefreshToken]),
  ],
  controllers: [AuthController, RoleController],
  providers: [
    AuthService,
    RoleService,
    RoleRepository,
    RefreshTokenRepository,
    UserRepository,
    JwtStrategy,
  ],
  exports: [AuthService, RoleService, RoleRepository, JwtModule, PassportModule],
})
export class AuthModule { }
