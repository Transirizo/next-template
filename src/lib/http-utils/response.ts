import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any(),
})

export type ApiResponse = z.infer<typeof apiResponseSchema>

export async function ok<T>(data?: T, message?: string, status = 200) {
  const t = await getTranslations('api.common')

  return NextResponse.json<ApiResponse>(
    {
      success: true,
      message: message || t('okMessageByDefault'),
      data: data || null,
    },
    { status }
  );
}

export async function err(message: string, status = 500) {
  const t = await getTranslations('api.common')

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: message || t('errorMessageByDefault'),
      data: null,
    },
    { status }
  );
}