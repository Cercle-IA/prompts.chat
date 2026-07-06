"use client";

import { Mail, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { analyticsPrompt } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Microsoft Teams icon
function TeamsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-6.75.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM24 10.5v4.25c0 2.35-1.9 4.25-4.25 4.25a4.24 4.24 0 0 1-3.29-1.56 6.75 6.75 0 0 1-12.71-3.19v-2.5a1 1 0 0 1 1-1h5.5a1 1 0 0 1 1 1v2.5a1.75 1.75 0 0 0 3.5.12V10.5a1 1 0 0 1 1-1h7.25a1 1 0 0 1 1 1zm-14.75-1H2a1 1 0 0 0-1 1v6.75A3.75 3.75 0 0 0 4.75 21a3.75 3.75 0 0 0 3.63-2.83A6.77 6.77 0 0 1 8 14.75v-2.5a2 2 0 0 1 1.25-1.85z" />
    </svg>
  );
}

interface ShareDropdownProps {
  title: string;
  url?: string;
  promptId?: string;
}

export function ShareDropdown({ title, url, promptId }: ShareDropdownProps) {
  const t = useTranslations("prompts");

  const handleShare = (platform: "email" | "teams") => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const promptTitle = `${title} Prompt`;

    let targetUrl = "";

    if (platform === "email") {
      const subject = encodeURIComponent(t("shareEmailSubject", { title: promptTitle }));
      const body = encodeURIComponent(t("shareEmailBody", { title: promptTitle, url: shareUrl }));
      targetUrl = `mailto:?subject=${subject}&body=${body}`;
    } else if (platform === "teams") {
      const message = encodeURIComponent(t("shareTeamsMessage", { title: promptTitle }));
      targetUrl = `https://teams.microsoft.com/share?href=${encodedUrl}&msgText=${message}`;
    }

    if (platform === "email") {
      window.location.href = targetUrl;
    } else {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
    analyticsPrompt.share(promptId, platform);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("email")}>
          <Mail className="h-4 w-4 mr-2" />
          {t("shareEmail")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("teams")}>
          <TeamsIcon className="h-4 w-4 mr-2" />
          {t("shareTeams")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
