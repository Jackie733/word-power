import { getDashboardStats } from "@/lib/database";
import DashboardClient from "@/components/dashboard-client";

export default async function Dashboard() {
  const dashboardData = await getDashboardStats();

  return <DashboardClient dashboardData={dashboardData} />;
}
