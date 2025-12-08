// app/api/public/bonds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
// / GET /api/public/bonds
export async function GET(_req: NextRequest) {
  try {
    const now = new Date();

    const bonds = await db.bonds.findMany({
      orderBy: { created_at: "desc" },
    });

    const data = bonds.map((bond) => {
      // ---------------- Numbers & BigInts ----------------

      // Total units offered
      const totalUnits = Number(bond.tl_unit_offered ?? 0);

      // Subscribed units (may be null)
      const subscribedUnits = Number(bond.tl_unit_subscribed ?? 0);

      // Available = offered - subscribed
      const availableUnits = Math.max(totalUnits - subscribedUnits, 0);

      // Face value is BigInt in smallest units → convert to Nu (tenths)
      const faceValueRaw = bond.face_value ?? BigInt(0);
      const faceValueTenths = Number(faceValueRaw); // e.g. 15000 => 1500.0 Nu if /10
      const faceValueNu = faceValueTenths / 10;

      // interest_rate is stored as STRING → parse to number
      // Handles "5", "5%", " 7.5 % " etc.
      const rateStr = (bond.interest_rate || "").toString().trim().replace("%", "").trim();
      const couponRate = Number(rateStr) || 0;

      // Active flag – simple heuristic:
      // OPEN + before subscription_end_date
      const isStatusOpen = bond.status === "OPEN" || bond.status === "Open";
      const isBeforeEnd = bond.subscription_end_date
        ? bond.subscription_end_date > now
        : true;

      const isActive = isStatusOpen && isBeforeEnd && availableUnits > 0;

      return {
        id: bond.id,
        bond_name: bond.bond_name,
        coupon_rate: couponRate,          // number (e.g. 5)
        total_units: totalUnits,          // number
        available_units: availableUnits,  // number
        face_value_nu: faceValueNu,       // number in Nu
        is_active: isActive,              // boolean
        // (optional extra fields if you ever need them)
        // market: bond.market,
        // status: bond.status,
        // maturity: bond.maturity.toISOString(),
      };
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error loading public bonds:", error);
    return NextResponse.json(
      { error: "Failed to load bonds" },
      { status: 500 }
    );
  }
}