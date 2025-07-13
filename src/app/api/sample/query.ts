import { get, post, put, del } from "@/lib/http-utils/request";
import { CreateSampleRequest, UpdateSampleRequest } from "./type";
import { ApiResponse } from "@/lib/http-utils/response";

export const listSampleQueryOptions = {
  queryKey: ['sample-list'],
  queryFn: async () => get('/api/sample') as Promise<ApiResponse>
}

export const createSampleMutationOptions = {
  mutationFn: (createSampleRequest: CreateSampleRequest) => post('/api/sample', createSampleRequest) as Promise<ApiResponse>
}

export const deleteSampleMutationOptions = {
  mutationFn: (id: string) => del(`/api/sample/${id}`) as Promise<ApiResponse>
}

export const updateSampleMutationOptions = {
  mutationFn: (id: string, updateSampleRequest: UpdateSampleRequest) => 
    put(`/api/sample/${id}`, updateSampleRequest) as Promise<ApiResponse>
}