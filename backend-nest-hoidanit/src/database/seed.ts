import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './data-source';
import { seedRoles } from './seeds/roles.seed';
import { seedUsers } from './seeds/users.seed';

const seeders: Record<string, (ds: typeof AppDataSource, count?: number) => Promise<void>> = {
  roles: seedRoles,
  users: seedUsers,
};

async function main() {
  const entity = process.argv[2];

  if (!entity || !seeders[entity]) {
    console.error(`Unknown entity: "${entity}"`);
    console.error(`Available: ${Object.keys(seeders).join(', ')}`);
    process.exit(1);
  }

  const count = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;

  await AppDataSource.initialize();
  try {
    await seeders[entity](AppDataSource, count);
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
