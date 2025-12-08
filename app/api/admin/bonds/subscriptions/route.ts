import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db"; 
// ⬆️ If your Prisma client is exported from somewhere else, adjust this import.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bondId = searchParams.get("bondId");

    if (!bondId) {
      return NextResponse.json(
        { error: "bondId is required" },
        { status: 400 }
      );
    }

    const subs = await db.subscriptions.findMany({
      where: { bond_id: bondId },
      orderBy: { created_at: "asc" },
      include: {
        user: {
          select: { national_id: true },
        },
      },
    });

    type Activity = {
      time: string;
      investorId: string;
      units: number;
      cumulative: number;
    };

    const activities: Activity[] = [];
    let cumulativeBtn = 0;

    for (const sub of subs) {
      const units = Number(sub.subscription_amt ?? 0);
      const amountBtn = Number(sub.committed_amount ?? 0) / 10; // adjust if needed

      cumulativeBtn += amountBtn;

      const investorId =
        sub.user?.national_id != null
          ? String(sub.user.national_id)
          : sub.user_id;

      activities.push({
        time: sub.created_at.toISOString(),
        investorId,
        units,
        cumulative: cumulativeBtn,
      });
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (err) {
    console.error("Error in /api/admin/bonds/subscriptions:", err);
    return NextResponse.json(
      { error: "Failed to fetch subscription analytics" },
      { status: 500 }
    );
  }
}
