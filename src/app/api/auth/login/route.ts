import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";
import { ok } from "@/lib/http-utils/response";
import { LoginRequestSchema } from "./type";

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const body = LoginRequestSchema.parse(await request.json())
    
    // TODO: Implement authentication logic
    console.log("Login attempt:", body)

    return ok()
})