import { post } from "@/lib/http-utils/request";
import { RegisterRequest } from "./type";
import { ApiResponse } from "@/lib/http-utils/response";

export const registerMutationOptions = {
  mutationFn: (registerRequest: RegisterRequest) => post('/api/auth/register', registerRequest) as Promise<ApiResponse>
};
