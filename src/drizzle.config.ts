import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
    schema: './drizzle/schema.ts',
    out: './drizzle',
    dbCredentials: {
        user: process.env.DBUser ?? '',
        password: process.env.DBPassword ?? '',
        host: process.env.DBHost ?? '',
        port: Number(process.env.DBPort) ?? 0,
        database: process.env.DBName ?? '',
        ssl: false,
    },
});
