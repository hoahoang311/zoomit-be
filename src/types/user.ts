import { InferInsertModel } from 'drizzle-orm';
import { user } from '../drizzle/schema';

export type InsertUser = InferInsertModel<typeof user>;
