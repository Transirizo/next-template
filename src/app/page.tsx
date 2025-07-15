"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRightIcon, CodeIcon, GithubIcon, CheckIcon, BookIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const projectUrl = "https://github.com/yiheee-lab/next-template"
  const onCopy = () => {
    navigator.clipboard.writeText(`git clone ${projectUrl}`)
    toast.success("Copied to clipboard")
  }

  const features = [
    "Next.js 15",
    "React 19",
    "Shadcn/ui",
    "TanStack Query",
    "Supabase",
    "i18n",
    "Dark/Light mode",
    "Form validation",
    "TypeScript",
    "Tailwind CSS"
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full p-6 font-serif">
      <div className="max-w-3xl w-full space-y-8 flex flex-col items-start justify-center">
        <section className="text-center space-y-4">
          <div className="flex flex-row items-center justify-start gap-2">
            <Image src="/icon/logo.svg" alt="logo" width={48} height={48} />
            <h1 className="text-4xl font-bold italic tracking-tight">next-template</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            面向中国地区开发者的 Next.js 通用实践模板和运维解决方案。
          </p>
        </section>
        
        <section className="bg-card p-6 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-4">快速开始</h2>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md mb-4">
            <CodeIcon className="h-4 w-4" />
            <code>{`git clone ${projectUrl}`}</code>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={onCopy}>
              Copy
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="gap-2 w-full sm:w-auto">
              <Link href={projectUrl}>
                <GithubIcon className="w-4 h-4" />
                查看源码
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2 w-full sm:w-auto">
              <Link href={projectUrl}>
                <BookIcon className="w-4 h-4" />
                文档
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2 w-full sm:w-auto">
              <Link href="/auth/login">
                <ArrowRightIcon className="w-4 h-4" />
                体验
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
