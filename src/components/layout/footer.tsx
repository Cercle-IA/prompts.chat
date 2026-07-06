"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import DeepWikiIcon from "@/../public/deepwiki.svg";
import { useBranding } from "@/components/providers/branding-provider";
import { analyticsExternal } from "@/lib/analytics";

export function Footer() {
  const branding = useBranding();
  const t = useTranslations("footer");

  return (
    <footer className="border-t shrink-0">
      <div className="container flex flex-col items-center gap-3 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:h-10 sm:py-0 sm:gap-4">
        <span className="flex items-center gap-1.5">
          <Image src="/logo.svg" alt="" width={14} height={14} className="dark:invert" />
          {new Date().getFullYear()} {branding.name}
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {!branding.useCloneBranding && (
            <>
              <Link href="https://deepwiki.com/f/prompts.chat" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1" onClick={() => analyticsExternal.clickFooterLink("deepwiki")}>
                <Image src={DeepWikiIcon} alt="" width={14} height={14} />
                DeepWiki
              </Link>
              <Link href="/how_to_write_effective_prompts" className="hover:text-foreground">{t("howTo")}</Link>
              <Link href="/docs/self-hosting" className="hover:text-foreground">{t("docs")}</Link>
              <Link href="/docs/api" className="hover:text-foreground">{t("api")}</Link>
              <Link href="/privacy" className="hover:text-foreground">{t("privacy")}</Link>
              <Link href="/terms" className="hover:text-foreground">{t("terms")}</Link>
              <Link href="/support" className="hover:text-foreground">{t("support")}</Link>
              <Link href="/about" className="hover:text-foreground">{t("about")}</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
