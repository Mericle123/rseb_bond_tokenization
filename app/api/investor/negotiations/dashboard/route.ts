// app/api/investor/negotiations/dashboard/route.ts
import { NextResponse } from "next/server";
import { getNegotiationDashboardData } from "@/server/lib/negotiations";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const data = await getNegotiationDashboardData(userId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Negotiation dashboard API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
