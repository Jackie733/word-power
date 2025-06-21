import { getStatsData } from "@/lib/database";
import StatsClient from "@/components/stats-client";

export default async function StatsPage() {
  const statsData = await getStatsData();

  return <StatsClient statsData={statsData} />;
}
