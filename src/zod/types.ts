import { z } from 'zod';
import { loginSchema } from './auth';

export type LoginSchemaType = z.infer<typeof loginSchema>;
