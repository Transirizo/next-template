import { NextResponse } from "next/server";
import { z } from "zod";

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any(),
})

export type ApiResponse = z.infer<typeof apiResponseSchema>

export function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse>(
    {
      success: true,
      message: message || 'Success',
      data: data || null,
    },
    { status }
  );
}

export function err(message: string, status = 500) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: message || 'Internal Server Error',
      data: null,
    },
    { status }
  );
}