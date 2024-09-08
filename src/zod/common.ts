import { z } from 'zod';

export const requiredString = z.string({ message: 'required field is string' });
export const optionalString = z.string().optional();
export const requiredNumber = z.number({ message: 'required field is number' });
export const optionalNumber = z.number().optional();

export const emailSchema = z.string().email({ message: 'Invalid email format' });
export const passwordSchema = z.string({ message: 'password is string' }).min(8, { message: 'min 8 character' });
