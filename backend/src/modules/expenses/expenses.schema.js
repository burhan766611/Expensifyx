import { z } from 'zod';

export const createExpenseSchema = z.object({
    amount: z.number().positive(),
    category: z.string().min(2),
    description: z.string().optional(),
    receiptUrl: z.string().url().optional(),
})

export const decisionSchema = z.object({
    decision: z.enum(["APPROVED", "REJECTED"]),
    comment: z.string().optional()
})