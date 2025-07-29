import { err } from "../http-utils/response";

export function withDefaultErrorHandling(handler: (request: Request) => Promise<Response>) {
    return async (request: Request): Promise<Response> => {
        try {
            return await handler(request);
        } catch (error: unknown) {
            console.error(error);
            return err("Unknown error");
        }
    };
}