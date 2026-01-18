import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    organizationName: z.string().min(2),
    inviteToken: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    inviteToken: z.string().optional(),
});

// export const signupSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
//     name: z.string().min(2)
// });

