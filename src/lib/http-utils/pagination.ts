import { z } from "zod"

export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
})

export type Pagination = z.infer<typeof paginationSchema>