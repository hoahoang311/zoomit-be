import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getEnv } from './env';
import * as schema from '../drizzle/schema';

const DBHost = getEnv('POSTGRES_HOST');
const DBPort = getEnv('POSTGRES_PORT');
const DBUser = getEnv('POSTGRES_USER');
const DBPassword = getEnv('POSTGRES_PASSWORD');
const DBName = getEnv('POSTGRES_DB');

const pool = new Pool({
    host: DBHost,
    port: Number(DBPort),
    user: DBUser,
    password: DBPassword,
    database: DBName,
    ssl: {
        rejectUnauthorized: false
    }
});

const db = drizzle(pool, { schema });

export default db;
