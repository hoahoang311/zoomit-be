import { z } from 'zod';
import { emailSchema, optionalString, passwordSchema, requiredNumber, requiredString } from './common';

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const signupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    nickname: requiredString,
    deviceId: optionalString,
    phoneNumber: requiredString,
    firstName: requiredString,
    lastName: requiredString,
    city: requiredString,
    state: requiredString,
    country: requiredString,
    artGenre: requiredString,
});

export const nicknameSchema = z.object({
    nickname: requiredString,
});
