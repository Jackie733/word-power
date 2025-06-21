import { NextResponse } from "next/server";
import { getStatsData } from "@/lib/database";

export async function GET() {
  try {
    const stats = await getStatsData();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats data:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
