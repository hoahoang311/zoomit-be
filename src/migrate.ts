import {migrate} from 'drizzle-orm/node-postgres/migrator'
import db from './util/db'

async function runMigration() {
    await migrate(db, {
        migrationsFolder: './drizzle',
        migrationsSchema: './drizzle/schema.ts',
        migrationsTable: 'postgres'
    })
}

runMigration()