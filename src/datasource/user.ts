import { eq } from 'drizzle-orm';
import { user } from '../drizzle/schema';
import db from '../util/db';
import { InsertUser } from '../types/user';

export const getUserById = async (id: number) => {
    try {
        const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);

        return result || null;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const [result] = await db.select().from(user).where(eq(user.email, email)).limit(1);

        return result || null;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const getUserByNickname = async (nickname: string) => {
    try {
        const [result] = await db.select().from(user).where(eq(user.nickname, nickname)).limit(1);

        return result || null;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const createNewUser = async (args: InsertUser) => {
    try {
        const result = await db.insert(user).values(args).returning();

        return result || null;
    } catch (err: any) {
        throw new Error(err.message);
    }
};
