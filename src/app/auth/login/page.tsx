"use client";
import { useMutation } from "@tanstack/react-query";
import { loginMutationOptions } from "@/app/api/auth/login/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginRequest, LoginRequestSchema } from "@/app/api/auth/login/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/lib/i18n/locale-switcher";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      <div className="w-1/3">
        <div className="flex flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();

  const login = useMutation({
    ...loginMutationOptions,
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.warning("登录失败", {
        description: error.message,
        position: "top-left",
      });
    },
  });
  const onSubmit = (formData: LoginRequest) => {
    login.mutate(formData);
  };

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (          
  <div>
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2">
        <a
          href="/auth/login"
          className="flex flex-col items-center gap-2 font-medium"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
        </a>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <div className="text-center text-sm">
          {t("noAccount")}
          <a
            href="/auth/register"
            className="underline underline-offset-4"
          >
            {t("register")}
          </a>
        </div>
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("email")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("password")}</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
      <Button type="submit">{t("login")}</Button>
    </form>
  </Form>
  </div>);
}