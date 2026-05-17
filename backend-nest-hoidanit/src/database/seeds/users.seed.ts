import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../features/user/entities/user.entity';
import { Role } from '../../features/auth/entities/role.entity';
import { seedRoles } from './roles.seed';

export async function seedUsers(dataSource: DataSource, count = 10) {
  await seedRoles(dataSource);

  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const existing = await userRepo.count();
  if (existing >= count) {
    console.log(`⏭  Users already seeded (${existing} records)`);
    return;
  }

  const adminRole = await roleRepo.findOneBy({ name: 'admin' });
  const customerRole = await roleRepo.findOneBy({ name: 'customer' });

  const users: Partial<User>[] = [];

  // Fixed admin account
  const adminExists = await userRepo.findOneBy({ email: 'admin@example.com' });
  if (!adminExists) {
    users.push({
      email: 'admin@example.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      status: UserStatus.ACTIVE,
      role: adminRole,
    });
  }

  // Random customers to fill up to `count`
  const needed = count - existing - users.length;
  for (let i = 0; i < needed; i++) {
    users.push({
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      password: await bcrypt.hash('password123', 10),
      status: faker.helpers.arrayElement([
        UserStatus.ACTIVE,
        UserStatus.ACTIVE,
        UserStatus.ACTIVE,
        UserStatus.INACTIVE,
      ]),
      role: customerRole,
    });
  }

  await userRepo.save(users);
  console.log(`✓ Seeded ${users.length} users (total: ${existing + users.length})`);
}
