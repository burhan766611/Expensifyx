import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});

export const acceptInviteSchema = z.object({
  token: z.string(),
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
});
