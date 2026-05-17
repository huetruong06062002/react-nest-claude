import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../../auth/repositories/role.repository';
import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../../auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let roleRepository: jest.Mocked<RoleRepository>;

  const mockRole: Role = { id: 1, name: 'ADMIN' };
  const mockUser: User = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'hashed_password',
    status: UserStatus.ACTIVE,
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    const mockRoleRepository: jest.Mocked<RoleRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: RoleRepository, useValue: mockRoleRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    roleRepository = module.get(RoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return an array of users', async () => {
      userRepository.findAll.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return a user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    const createDto = {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'plaintext',
      roleId: 1,
    };

    it('should create and return a new user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      roleRepository.findById.mockResolvedValue(mockRole);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createDto);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'admin@example.com', password: 'hashed_password', role: mockRole }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if roleId does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      roleRepository.findById.mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should create user without role when roleId is not provided', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({ ...mockUser, role: null });

      const result = await service.create({ email: 'user@example.com', name: 'User', password: 'pass' });
      expect(result.role).toBeNull();
      expect(roleRepository.findById).not.toHaveBeenCalled();
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update and return the user', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(null);
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, { name: 'Updated Name' });
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException when updating to existing email', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue({ ...mockUser, id: 2 });
      await expect(service.update(1, { email: 'other@example.com' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should hash password when updating password', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await service.update(1, { password: 'newpassword' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should delete the user', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user to delete is not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
