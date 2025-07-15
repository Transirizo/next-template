"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRightIcon, CodeIcon, GithubIcon, BookIcon, CloudIcon, DatabaseIcon, GlobeIcon, LayoutIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { LocaleSwitcher } from "@/lib/i18n/locale-switcher";
import { useTranslations } from "next-intl";

const projectUrl = "https://github.com/yiheee-lab/next-template"


export default function Home() {
  const onCopy = () => {
    navigator.clipboard.writeText(`git clone ${projectUrl}`)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="font-serif">
      <Nav />
      <main className="font-serif">
        <Hero onCopy={onCopy} />
      </main>
    </div>
  )
}

function Nav() {
  const t = useTranslations("home.nav");

  return (
    <nav className="flex flex-row items-center justify-between px-4 py-4">
      <div className="flex flex-row items-center justify-start gap-2">
        <Image src="/icon/logo.svg" alt="logo" width={48} height={48} />
        <h1 className="text-4xl italic tracking-tight">next-template</h1>
      </div>
      <div className="flex flex-row items-center justify-start gap-2">
        <LocaleSwitcher />
        <Button variant="secondary" asChild>
          <Link href={projectUrl}>
            <GithubIcon className="w-4 h-4" />
            <span>{t("github")}</span>
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={projectUrl}>
            <BookIcon className="w-4 h-4" />
            <span>{t("docs")}</span>
          </Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/auth/login">
            <ArrowRightIcon className="w-4 h-4" />
            <span>{t("try")}</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}

interface HeroProps {
  onCopy: () => void;
}

function Hero({ onCopy }: HeroProps) {
  const t = useTranslations("home");
  const heroT = useTranslations("home.hero");
  const featuresT = useTranslations("home.features");

  return (
    <section className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <h2 className="text-4xl font-bold mb-6">
        {heroT("title")}
      </h2>
      <p className="text-xl max-w-3xl mb-8">
        {heroT("subtitle")}
      </p>

      <div className="flex gap-4 mb-4">
        <Button size="lg" onClick={onCopy}>
          <CodeIcon className="w-5 h-5 mr-2" />
          {heroT("clone")}
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/sample">
            <LayoutIcon className="w-5 h-5 mr-2" />
            {heroT("sample")}
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-md mb-10 text-xs">
        <CodeIcon className="h-4 w-4" />
        <code>{`git clone ${projectUrl}`}</code>
        <Button variant="ghost" size="sm" className="p-2" onClick={onCopy}>
          {heroT("copy")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        <FeatureCard 
          icon={<CloudIcon className="w-10 h-10" />}
          title={featuresT("fc.title")} 
          description={featuresT("fc.description")} 
        />
        <FeatureCard 
          icon={<DatabaseIcon className="w-10 h-10" />}
          title={featuresT("supabase.title")} 
          description={featuresT("supabase.description")} 
        />
        <FeatureCard 
          icon={<GlobeIcon className="w-10 h-10" />}
          title={featuresT("i18n.title")} 
          description={featuresT("i18n.description")} 
        />
        <FeatureCard 
          icon={<LayoutIcon className="w-10 h-10" />}
          title={featuresT("http.title")} 
          description={featuresT("http.description")} 
        />
        <FeatureCard 
          icon={<CodeIcon className="w-10 h-10" />}
          title={featuresT("tech.title")} 
          description={featuresT("tech.description")} 
        />
        <FeatureCard 
          icon={<ArrowRightIcon className="w-10 h-10" />}
          title={featuresT("ready.title")} 
          description={featuresT("ready.description")} 
        />
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center bg-secondary/20 p-6 rounded-lg text-center hover:bg-secondary transition-colors">
      <div className="mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
