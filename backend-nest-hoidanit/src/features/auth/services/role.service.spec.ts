import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from '../repositories/role.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: jest.Mocked<RoleRepository>;

  const mockRole: Role = {
    id: 1,
    name: 'ADMIN',
    // users: [],
    // createdAt: new Date(),
    // updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRoleRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get(RoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      roleRepository.findAll.mockResolvedValue([mockRole]);
      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
      expect(roleRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      roleRepository.findById.mockResolvedValue(mockRole);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRole);
      expect(roleRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if role is not found', async () => {
      roleRepository.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new role', async () => {
      roleRepository.findByName.mockResolvedValue(null);
      roleRepository.save.mockResolvedValue(mockRole);

      const result = await service.create({ name: 'ADMIN' });
      expect(result).toEqual(mockRole);
      expect(roleRepository.findByName).toHaveBeenCalledWith('ADMIN');
      expect(roleRepository.save).toHaveBeenCalledWith({ name: 'ADMIN' });
    });

    it('should throw ConflictException if role name already exists', async () => {
      roleRepository.findByName.mockResolvedValue(mockRole);
      await expect(service.create({ name: 'ADMIN' })).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update and return the role', async () => {
      roleRepository.findById.mockResolvedValue(mockRole);
      roleRepository.findByName.mockResolvedValue(null);
      const updatedRole = { ...mockRole, name: 'SUPER_ADMIN' };
      roleRepository.save.mockResolvedValue(updatedRole);

      const result = await service.update(1, { name: 'SUPER_ADMIN' });
      expect(result).toEqual(updatedRole);
      expect(roleRepository.save).toHaveBeenCalledWith({ ...mockRole, name: 'SUPER_ADMIN' });
    });

    it('should throw ConflictException if updating to an existing role name', async () => {
      roleRepository.findById.mockResolvedValue(mockRole);
      roleRepository.findByName.mockResolvedValue({ id: 2, name: 'USER' } as Role);

      await expect(service.update(1, { name: 'USER' })).rejects.toThrow(ConflictException);
    });

    it('should not check for name conflict if name is not changed', async () => {
      roleRepository.findById.mockResolvedValue(mockRole);
      roleRepository.save.mockResolvedValue(mockRole);

      const result = await service.update(1, { name: 'ADMIN' });
      expect(result).toEqual(mockRole);
      expect(roleRepository.findByName).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the role', async () => {
      roleRepository.findById.mockResolvedValue(mockRole);
      roleRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);
      expect(roleRepository.findById).toHaveBeenCalledWith(1);
      expect(roleRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if role to delete is not found', async () => {
      roleRepository.findById.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
