import { DataSource } from 'typeorm';
import { Role } from '../../features/auth/entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const repo = dataSource.getRepository(Role);

  if ((await repo.count()) > 0) {
    console.log('⏭  Roles already seeded');
    return;
  }

  await repo.save([{ name: 'customer' }, { name: 'admin' }]);
  console.log('✓ Seeded 2 roles: customer, admin');
}
