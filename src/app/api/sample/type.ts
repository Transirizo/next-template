import { sampleSchema } from "@/types/sample";
import { z } from "zod";

// GET 
export const listSampleResponseSchema = z.array(sampleSchema)

export type ListSampleResponse = z.infer<typeof listSampleResponseSchema>

// POST
export const createSampleRequestSchema = sampleSchema.omit({
    id: true,
    created_at: true,
})

export type CreateSampleRequest = z.infer<typeof createSampleRequestSchema>

export const createSampleResponseSchema = sampleSchema

export type CreateSampleResponse = z.infer<typeof createSampleResponseSchema>


// PATCH
export const updateSampleRequestSchema = sampleSchema.omit({
    created_at: true,
})

export type UpdateSampleRequest = z.infer<typeof updateSampleRequestSchema>

// DELETE
export const deleteSampleRequestSchema = sampleSchema.pick({
    id: true,
})

export type DeleteSampleRequest = z.infer<typeof deleteSampleRequestSchema>