import { createClient } from "@/lib/supabase/server";
import { ok } from "@/lib/http-utils/response";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";

export const GET = withDefaultErrorHandling(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase.from('samples').select('*')

    if (error) {
        throw error;
    }

    return await ok(data)
})

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const supabase = await createClient()

    const body = await request.json()

    const data = (await supabase.from('samples').insert(body)).data

    return await ok(data)
})

export const PATCH = withDefaultErrorHandling(async (request: Request) => {
    const supabase = await createClient()

    const body = await request.json()

    const data = (await supabase.from('samples').update(body).eq('id', request.url.split('/').pop())).data

    return await ok(data)
})


export const DELETE = withDefaultErrorHandling(async (request: Request) => {
    const supabase = await createClient()

    const data = (await supabase.from('samples').delete().eq('id', request.url.split('/').pop())).data

    return await ok(data)
})