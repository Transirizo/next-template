import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { err } from "../http-utils/response";

export function withDefaultErrorHandling(handler: (request: Request) => Promise<Response>) {
    return async (request: Request): Promise<Response> => {
        try {
            return await handler(request);
        } catch (error: unknown) {
            if (error instanceof AuthError) {
                return err(error.code + " " + error.message, error.status || 500);
            }
            if (error instanceof PostgrestError) {
                return err(error.code + " " + error.message, 500);
            }
            console.error(error);
            return err("Unknown error");
        }
    };
}