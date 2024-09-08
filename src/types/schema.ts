import { InferInsertModel } from 'drizzle-orm';
import { refreshToken } from '../drizzle/schema';

export type InsertRefreshToken = InferInsertModel<typeof refreshToken>;
