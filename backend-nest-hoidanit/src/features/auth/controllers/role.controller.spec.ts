import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';

describe('RoleController', () => {
  let controller: RoleController;
  let roleService: jest.Mocked<RoleService>;

  const mockRole: Role = {
    id: 1,
    name: 'ADMIN',
    // users: [],
    // createdAt: new Date(),
    // updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRoleService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      roleService.findAll.mockResolvedValue([mockRole]);
      const result = await controller.findAll();
      expect(result).toEqual([mockRole]);
      expect(roleService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      roleService.findOne.mockResolvedValue(mockRole);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockRole);
      expect(roleService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a role', async () => {
      const dto: CreateRoleDto = { name: 'ADMIN' };
      roleService.create.mockResolvedValue(mockRole);

      const result = await controller.create(dto);
      expect(result).toEqual(mockRole);
      expect(roleService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return a role', async () => {
      const dto: UpdateRoleDto = { name: 'SUPER_ADMIN' };
      const updatedRole = { ...mockRole, name: 'SUPER_ADMIN' };
      roleService.update.mockResolvedValue(updatedRole);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedRole);
      expect(roleService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove the role', async () => {
      roleService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(roleService.remove).toHaveBeenCalledWith(1);
    });
  });
});
