import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
    schema: './src/schema/*',
    out: './drizzle',
    dbCredentials: {
        user: 'postgres',
        password: process.env.DATABASE_PASSWORD,
        host: '127.0.0.1',
        port: 5432,
        database: 'db',
    },
});
