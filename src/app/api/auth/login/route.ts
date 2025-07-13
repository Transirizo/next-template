import { createClient } from "@/lib/supabase/server";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";
import { ok } from "@/lib/http-utils/response";
import { LoginRequestSchema } from "./type";

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const supabase = await createClient()
    const body = LoginRequestSchema.parse(await request.json())

    const { error } = await supabase.auth.signInWithPassword(body)

    if (error) {
        throw error;
    }

    return ok()
})