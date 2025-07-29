import { RegisterRequestSchema } from "./type";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";
import { ok } from "@/lib/http-utils/response";

export const POST = withDefaultErrorHandling(async (request: Request) => {
    const body = RegisterRequestSchema.parse(await request.json())

    // TODO: Implement user registration logic
    console.log("Registration attempt:", body)

    return ok(null)
})
