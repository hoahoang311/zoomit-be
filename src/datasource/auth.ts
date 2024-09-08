import { refreshToken } from '../drizzle/schema';
import { AddRefreshTokenToWhiteListArgs } from '../types/auth';
import { eq } from 'drizzle-orm';
import db from '../util/db';
import { hashToken } from '../util/token';

export const addRefreshTokenToWhiteList = async (args: AddRefreshTokenToWhiteListArgs) => {
    return await db.insert(refreshToken).values({ ...args, hashedToken: hashToken(args.refreshToken) });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = async (id: string) => {
    const [token] = await db.select().from(refreshToken).where(eq(refreshToken.id, id)).limit(1);

    return token || null;
};

// soft delete tokens after usage.
export const deleteRefreshToken = async (id: string) => {
    const result = await db.update(refreshToken).set({ revoked: true }).where(eq(refreshToken.id, id));

    return result || null;
};
