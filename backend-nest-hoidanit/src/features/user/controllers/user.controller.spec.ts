import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserStatus } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'hashed_password',
    status: UserStatus.ACTIVE,
    role: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      userService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'password123',
      };
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);
      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      userService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(userService.remove).toHaveBeenCalledWith(1);
    });
  });
});
