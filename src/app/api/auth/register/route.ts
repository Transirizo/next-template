import { createClient } from "@/lib/supabase/server";
import { RegisterRequestSchema } from "./type";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";
import { ok } from "@/lib/http-utils/response";

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const supabase = await createClient()
    const body = RegisterRequestSchema.parse(await request.json())

    const { error } = await supabase.auth.signUp(body)

    if (error) {
        throw error;
    }

    return ok(null)
})
