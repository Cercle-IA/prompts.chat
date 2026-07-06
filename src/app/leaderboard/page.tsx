import { getTranslations } from "next-intl/server";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";

export default async function LeaderboardPage() {
  const t = await getTranslations("leaderboard");

  const translations = {
    title: t("title"),
    description: t("description"),
    allTime: t("allTime"),
    thisMonth: t("thisMonth"),
    thisWeek: t("thisWeek"),
    noData: t("noData"),
    prompts: t("prompts"),
    upvotes: t("upvotes"),
    perPrompt: t("perPrompt"),
    sortByTotal: t("sortByTotal"),
    sortByRatio: t("sortByRatio"),
  };

  return <LeaderboardContent translations={translations} />;
}
