"use client";
import { useMutation } from "@tanstack/react-query";
import { registerMutationOptions } from "@/app/api/auth/register/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterRequest, RegisterRequestSchema } from "@/app/api/auth/register/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/lib/i18n/locale-switcher";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      <div className="w-1/3">
        <div className="flex flex-col gap-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const t = useTranslations("auth.register");
  const router = useRouter();

  const register = useMutation({
    ...registerMutationOptions,
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.warning("注册失败", {
        description: error.message,
        position: "top-left",
      });
    },
  });

  const onSubmit = (formData: RegisterRequest) => {
    register.mutate(formData);
  };

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
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
            <h1 className="text-xl font-bold">{t("title")}</h1>
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
          <Button type="submit">{t("register")}</Button>
        </form>
      </Form>
    </div>
  );
}