import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db"; // adjust if your Prisma client is elsewhere

// Match your front-end ActivityRow type
type ActivityKind = 
  | "event"
  | "peer"
  | "allocation"
  | "subscription"
  | "buy_sell"
  | "send"
  | "redeem"
  | "buy";

type Status = "Completed" | "Complete" | "Pending" | "In progress" | "Failed";

type ActivityRow = {
  id: string;
  asset: string; // was "RICB Bond" | "BTN coin"
  bondName?: string | null; // <-- NEW: actual bond name
  type:
    | "Purchased"
    | "Transfer In"
    | "Transfer Out"
    | "Owner transfer"
    | "Airdrop"
    | "Redeem"
    | "Subscription"
    | "Send"
    | "Buy";
  date: string;
  amountLabel: string;
  status: Status;
  detail: string;
  tx_hash: string | null;
  kind: ActivityKind;
  amount: number;
  balance: number;
  investor?: string | null;
  investorId?: string | null;
  transactionId?: string | null;
  notes?: string | null;
};

export async function GET(req: NextRequest) {
  try {
    // 1) Fetch everything in parallel
    const [subs, allocs, txs, events] = await Promise.all([
      db.subscriptions.findMany({
        include: {
          user: { select: { name: true, national_id: true } },
          bond: { select: { bond_name: true } },
        },
      }),
      db.allocations.findMany({
        include: {
          user: { select: { name: true, national_id: true } },
          bond: { select: { bond_name: true, face_value: true } },
        },
      }),
      db.transactions.findMany({
        include: {
          from: { select: { name: true, national_id: true } },
          to: { select: { name: true, national_id: true } },
        },
      }),
      db.events.findMany({
        include: {
          user: { select: { name: true, national_id: true } },
          bond: { select: { bond_name: true } },
        },
      }),
    ]);

    const rows: ActivityRow[] = [];

    // 2) Subscriptions → kind: "subscription", asset: BTN coin (cash-in)
    for (const sub of subs) {
      const amountBtn = Number(sub.committed_amount ?? 0n) / 10; // assuming 1 BTN = 10 smallest units
      const investorName = sub.user?.name ?? null;
      const investorId =
        sub.user?.national_id != null ? String(sub.user.national_id) : sub.user_id;

     rows.push({
  id: `sub_${sub.id}`,
  asset: "BTN coin",                       // what kind of asset
  bondName: sub.bond?.bond_name ?? null,   // <-- actual bond name
  type: "Transfer In",
  date: sub.created_at.toISOString().slice(0, 10),
  amountLabel: `BTN ${amountBtn.toLocaleString()}`,
  status: "Completed",
  detail: `Subscription commit for bond ${sub.bond.bond_name}`,
  tx_hash: sub.tx_hash,
  kind: "subscription",
  amount: amountBtn,
  balance: 0,
  investor: investorName,
  investorId,
  transactionId: sub.tx_hash || null,
  notes: null,
});

    }

    // 3) Allocations → kind: "allocation", asset: RICB Bond
    for (const alloc of allocs) {
      const units = Number(alloc.allocated_tenths ?? 0n) / 10; // tenths → units
      const faceValueBtn = Number(alloc.bond.face_value ?? 0n) / 10;
      const amountBtn = units * faceValueBtn;

      const investorName = alloc.user?.name ?? null;
      const investorId =
        alloc.user?.national_id != null ? String(alloc.user.national_id) : alloc.user_id;

     rows.push({
  id: `alloc_${alloc.id}`,
  asset: "RICB Bond",
  bondName: alloc.bond?.bond_name ?? null,   // <-- HERE
  type: "Purchased",
  date: alloc.created_at.toISOString().slice(0, 10),
  amountLabel: `RICB ${units.toLocaleString()} units`,
  status: "Completed",
  detail: `Allocation for bond ${alloc.bond.bond_name}`,
  tx_hash: alloc.tx_hash,
  kind: "allocation",
  amount: amountBtn,
  balance: 0,
  investor: investorName,
  investorId,
  transactionId: alloc.tx_hash || null,
  notes: null,
});

    }

    // 4) Peer Transactions → kind: "peer", asset: BTN coin
    for (const tx of txs) {
      const fromName = tx.from?.name ?? "Unknown sender";
      const toName = tx.to?.name ?? "Unknown receiver";
      const fromId =
        tx.from?.national_id != null ? String(tx.from.national_id) : tx.user_from;
      const toId = tx.to?.national_id != null ? String(tx.to.national_id) : tx.user_to;

      rows.push({
        id: `tx_${tx.id}`,
        asset: "BTN coin",
        type: "Transfer Out", // from system perspective (you can adjust)
        date: tx.created_at.toISOString().slice(0, 10),
        amountLabel: `BTN —`, // you don’t track an amount in this table
        status: "Completed",
        detail: `Peer transfer from ${fromName} (${fromId}) to ${toName} (${toId})`,
        tx_hash: tx.tx_hash,
        kind: "peer",
        amount: 0, // no numeric amount available here
        balance: 0,
        investor: fromName,
        investorId: fromId,
        transactionId: tx.tx_hash || null,
        notes: null,
      });
    }

    // 5) Events → kind: "event" / "redeem" based on Type enum
    for (const ev of events) {
        const bondName = ev.bond?.bond_name ?? null;

      const investorName = ev.user?.name ?? null;
      const investorId =
        ev.user?.national_id != null ? String(ev.user.national_id) : ev.user_id;

      let asset: "RICB Bond" | "BTN coin" = "RICB Bond";
      let type: ActivityRow["type"] = "Subscription";
      let kind: ActivityKind = "event";
      let amount = 0;
      let amountLabel = "—";

      if (ev.type === "subscription") {
        asset = "RICB Bond";
        type = "Subscription";
        kind = "event";
        amountLabel = `Subscription event for ${ev.bond.bond_name}`;
      } else if (ev.type === "transfer") {
        asset = "BTN coin";
        type = "Transfer In";
        kind = "event";
        amountLabel = "Transfer event";
      } else if (ev.type === "maturity") {
        asset = "RICB Bond";
        type = "Redeem";
        kind = "redeem";
        amountLabel = `Maturity of ${ev.bond.bond_name}`;
      }

    rows.push({
  id: `event_${ev.id}`,
  asset,
  bondName,                          // <-- add this
  type,
  date: ev.created_at.toISOString().slice(0, 10),
  amountLabel,
  status: "Completed",
  detail: ev.details,
  tx_hash: ev.tx_hash,
  kind,
  amount,
  balance: 0,
  investor: investorName,
  investorId,
  transactionId: ev.tx_hash || null,
  notes: null,
});

    }

    // 6) Sort by date (newest first)
    rows.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error building ledger:", err);
    return NextResponse.json(
      { error: "Failed to load system ledger" },
      { status: 500 }
    );
  }
}
