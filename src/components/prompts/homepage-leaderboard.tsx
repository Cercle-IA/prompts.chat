import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Trophy, Medal, Award } from "lucide-react";
import { getLeaderboard } from "@/lib/leaderboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="h-6 w-6 text-yellow-500" />;
  } else if (rank === 2) {
    return <Medal className="h-6 w-6 text-gray-400" />;
  } else if (rank === 3) {
    return <Award className="h-6 w-6 text-amber-600" />;
  }
  return (
    <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-muted-foreground">
      {rank}
    </span>
  );
}

export async function HomepageLeaderboard() {
  const t = await getTranslations("discovery");
  const tLeaderboard = await getTranslations("leaderboard");
  const tNav = await getTranslations("nav");

  const { leaderboard } = await getLeaderboard("all");
  const topUsers = leaderboard.slice(0, 5);

  if (topUsers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-b">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">{tNav("leaderboard")}</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/leaderboard" prefetch={false}>
              {t("viewFullLeaderboard")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="max-w-3xl mx-auto rounded-lg border divide-y">
          {topUsers.map((user, index) => (
            <Link
              key={user.id}
              href={`/@${user.username}`}
              prefetch={false}
              className="flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 flex justify-center">
                <RankBadge rank={index + 1} />
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || undefined} alt={user.name || user.username} />
                <AvatarFallback>
                  {(user.name || user.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name || user.username}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold">{user.promptCount}</p>
                  <p className="text-xs text-muted-foreground">{tLeaderboard("prompts")}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-primary">{user.totalUpvotes}</p>
                  <p className="text-xs text-muted-foreground">{tLeaderboard("upvotes")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
