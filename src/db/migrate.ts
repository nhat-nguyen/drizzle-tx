import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '.';

async function main() {
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations complete!');
    process.exit(0);
  } catch (e) {
    console.error('Migrations failed!', e);
    process.exit(1);
  }
}

main();
