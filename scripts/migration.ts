import { exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Get migration name from CLI argument
const migrationName = process.argv[2];

// Show error if no migration name is provided
if (!migrationName) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❌ Please provide a migration name. Example: npm run migration:generate AddUserTable',
  );
  process.exit(1);
}

// Define migrations directory
const migrationsDir = join('src', 'database', 'migrations');

// Create the directory if it doesn't exist
if (!existsSync(migrationsDir)) {
  mkdirSync(migrationsDir, { recursive: true });
  console.log('\x1b[33m%s\x1b[0m', `📁 Created '${migrationsDir}' directory.`);
}

// Build the command to generate the migration
const command = `npm run typeorm migration:generate ${migrationsDir}/${migrationName} -- -p`;

// Execute the command
(() =>
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        '❌ An error occurred while generating the migration:',
      );
      console.error(error);
      console.error(stderr);
      return;
    }
    console.log(stdout);
    console.log('\x1b[32m%s\x1b[0m', '✅ Migration generated successfully.');
  }))();
