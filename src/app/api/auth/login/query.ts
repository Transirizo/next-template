import { post } from "@/lib/http-utils/request";
import { ApiResponse } from "@/lib/http-utils/response";
import { LoginRequest } from "./type";

export const loginMutationOptions = {
  mutationFn: (loginRequest: LoginRequest) => post('/api/auth/login', loginRequest) as Promise<ApiResponse>
};