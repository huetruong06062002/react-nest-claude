import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../../auth/repositories/role.repository';
import { Role } from 'src/features/auth/entities/role.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) { }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" is already in use`);
    }

    let role: Role | null = null;
    if (dto.roleId) {
      role = await this.roleRepository.findById(dto.roleId);
      if (!role) throw new NotFoundException(`Role #${dto.roleId} not found`);
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    this.logger.log(`Creating user: ${dto.email}`);
    return this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashed,
      status: dto.status,
      role,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }
    }

    let role = user.role;
    if (dto.roleId !== undefined) {
      role =
        dto.roleId === null
          ? null
          : await this.roleRepository.findById(dto.roleId);
      if (dto.roleId && !role) {
        throw new NotFoundException(`Role #${dto.roleId} not found`);
      }
    }

    const updateData: Partial<User> = {
      ...user,
      ...(dto.email && { email: dto.email }),
      ...(dto.name && { name: dto.name }),
      ...(dto.status && { status: dto.status }),
      role,
    };

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    this.logger.log(`Updating user #${id}`);
    return this.userRepository.save(updateData);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    this.logger.log(`Deleting user #${id}`);
    await this.userRepository.delete(id);
  }
}
