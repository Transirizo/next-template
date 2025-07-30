import { err } from "../http-utils/response";

// 支持静态路由的错误处理
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

// 支持动态路由的错误处理 (带params参数)
export function withDefaultErrorHandlingForDynamicRoute<T = any>(
  handler: (request: Request, context: { params: T }) => Promise<Response>
) {
  return async (request: Request, context: { params: T }): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error: unknown) {
      console.error(error);
      return err("Unknown error");
    }
  };
}
