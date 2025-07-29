import { ok } from "@/lib/http-utils/response";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";

// Mock data for samples
const samples = [
    { id: 1, name: "Sample 1", created_at: new Date().toISOString() },
    { id: 2, name: "Sample 2", created_at: new Date().toISOString() }
];
let nextId = 3;

export const GET = withDefaultErrorHandling(async () => {
    return await ok(samples)
})

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const body = await request.json()
    const newSample = { ...body, id: nextId++, created_at: new Date().toISOString() }
    samples.push(newSample)

    return await ok(newSample)
})

export const PATCH = withDefaultErrorHandling(async (request: Request) => {
    const body = await request.json()
    const id = parseInt(request.url.split('/').pop() || '0')
    
    const index = samples.findIndex(s => s.id === id)
    if (index !== -1) {
        samples[index] = { ...samples[index], ...body }
        return await ok(samples[index])
    }

    return await ok(null)
})

export const DELETE = withDefaultErrorHandling(async (request: Request) => {
    const id = parseInt(request.url.split('/').pop() || '0')
    const index = samples.findIndex(s => s.id === id)
    
    if (index !== -1) {
        const deleted = samples.splice(index, 1)[0]
        return await ok(deleted)
    }

    return await ok(null)
})