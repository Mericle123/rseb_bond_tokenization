"use server"

import { BondType, Status } from "@prisma/client";
// import { Param } from "@/generated/prisma/runtime/library";
import { db } from "@/server/db";
import { success } from "zod";
import { id } from "zod/v4/locales";
import { transBtn } from "../blockchain/btnc";
import { createBondSeries } from "../blockchain/bond";



// export async function bondMint({bond_symbol, bond_name, face_v, interest_rate, 25, 26,  tl_unit_offered}) {
//         const trans = await mintBond({ symbol: bond_symbol, name: bond_name, faceValue: face_v, rateBps: interest_rate, tenureDays: 25, issuerAddress: "0xd6b57889a695d0092c9393ee3c9da9f0a4e48460366f2892f7f4303bf65a29c8", startMs: 26, totalSupplyTenths: tl_unit_offered })
//         if(!trans){
//             console.log("Error Here in allocation")
//         }
//     }

export async function bondCreation(formData: FormData) {
    const bond_name = formData.get("bondName") as string
    const face_value = formData.get("face_value") as string
    const maturityStr = formData.get("maturity") as string
    const interest_rate = formData.get("interest_rate") as string
    const bond_type = formData.get("bond_type") as BondType
    const bond_symbol = formData.get("bondSymbol2") as string
    const organization_name = formData.get("org_name") as string
    const purpose = formData.get("purpose") as string
    const tl_unit = formData.get("totalUnitOffered") as string

    const sub_period = formData.get("subscription_period") as string
    const subscription_period = Number(sub_period);        // days
    const tl_unit_offered = Number(tl_unit);              // human units (e.g. 150)
    const face_v = Number(face_value);                    // human BTNC (e.g. 100)
    const maturity = new Date(maturityStr);
    const now = new Date();

    if (Number.isNaN(subscription_period) || subscription_period <= 0) {
        throw new Error("Invalid subscription period");
    }
    if (Number.isNaN(tl_unit_offered) || tl_unit_offered <= 0) {
        throw new Error("Invalid total units offered");
    }
    if (Number.isNaN(face_v) || face_v <= 0) {
        throw new Error("Invalid face value");
    }

    // interest_rate from form is likely "10" (meaning 10%).
    // Convert % => basis points (bps): 10% -> 1000
    const interestNum = Number(interest_rate);
    if (Number.isNaN(interestNum)) {
        throw new Error("Invalid interest rate");
    }
    const rateBps = Math.round(interestNum * 100); // supports decimals like 10.5% -> 1050 bps

    const startMs = now.getTime();
    const maturityMs = maturity.getTime();


    try {
        const now = new Date()
        const endDate = new Date(now.getTime() + subscription_period * 24 * 60 * 60 * 1000);
        const result = await createBondSeries({
            symbol: bond_symbol,
            name: bond_name,
            organizationName: organization_name,
            bondType: bond_type,
            faceValue: face_v,              // human units; createBondSeries will convert to tenths
            totalUnits: tl_unit_offered,    // human units; createBondSeries will convert to tenths
            rateBps,
            startMs,
            maturityMs,
            subscriptionPeriodDays: subscription_period,
            purpose,
        });
        if (!result.ok) {
            throw new Error("Bond creation transaction failed");
        }

        return {
            success: true,
            txDigest: result.digest,
            seriesId: result.seriesId,
            bond: result.bond,
        };
    }
    catch (error) {
        throw error
    }
}

export async function fetchBond() {
    try {
        const bonds = await db.bonds.findMany();

        if (!bonds || bonds.length === 0) {
            return [];
        }

        return bonds.map((b) => ({
            ...b,
            face_value_human: formatBtnFromTenths(b.face_value),
            tl_unit_offered_human: formatBtnFromTenths(b.tl_unit_offered),
            tl_unit_subscribed_human: formatBtnFromTenths(b.tl_unit_subscribed ?? 0),
        }));
    } catch (error) {
        console.error(error);
        throw new Error("No Bonds found");
    }
}


export async function fetchBonds(page: number, limit: number, allocated: boolean) {
    try {
        // 1. Sanitize inputs to prevent invalid queries
        const pageNum = Math.max(1, page);
        const takeNum = Math.max(1, limit);

        // 2. Calculate the 'skip' value
        // This is the core logic of pagination.
        // Page 1: (1 - 1) * 10 = skip 0
        // Page 2: (2 - 1) * 10 = skip 10
        // Page 3: (3 - 1) * 10 = skip 20
        const skip = (pageNum - 1) * takeNum;

        // 3. Use Prisma's 'take' and 'skip' arguments
        const bonds = await db.bonds.findMany({
            where: { allocated: allocated },
            take: takeNum,  // 'take' is like 'limit' (how many to get)
            skip: skip,     // 'skip' is like 'offset' (how many to bypass)
            orderBy: {
                created_at: 'desc', // Optional: It's good practice to order results
            },
        });

        // 4. Return the array of bonds (or an empty array if none found)
        // The frontend logic handles an empty array correctly.
        return bonds.map((b) => ({
            ...b,
            face_value_human: formatBtnFromTenths(b.face_value),
            tl_unit_offered_human: formatBtnFromTenths(b.tl_unit_offered),
            tl_unit_subscribed_human: formatBtnFromTenths(b.tl_unit_subscribed ?? 0),
        }));


    } catch (error) {
        console.error("Error in fetchBond:", error);
        // 5. Throw the error so the frontend 'catch' block can handle it
        // Returning a string like "No Bonds found" would crash the frontend
        // because it expects an array (to use .map()).
        throw new Error("Failed to fetch bonds");
    }
}


export async function fetchBondById(bondId: string) {
    try {
        const bond = await db.bonds.findUnique({ where: { id: bondId } });
        if (!bond) {
            throw new Error("Such bond doesn't exist");
        }

        return {
            ...bond,
            face_value_human: formatBtnFromTenths(bond.face_value),
            tl_unit_offered_human: formatBtnFromTenths(bond.tl_unit_offered),
            tl_unit_subscribed_human: formatBtnFromTenths(bond.tl_unit_subscribed ?? 0),
        };
    } catch (error) {
        console.error(error);
        throw new Error("No such bond found");
    }
}


// export async function subscribeToBond(
//   bondId: string,
//   seriesObjectId: string,
//   {
//     userId,
//     walletAddress,
//     mnemonics,
//     subscription_amt,
//   }: {
//     userId: string;
//     walletAddress: string;
//     mnemonics: string;
//     subscription_amt: string | number;
//   }
// ) {
//   const amountTenths = toTenths(subscription_amt);

//   const coinType = btncCoinType();
//   const coins = await getAllCoins(walletAddress, coinType);
//   if (!coins.length) {
//     throw new Error("No BTNC balance available for subscription");
//   }
//   const paymentCoinIds = coins.map((c: any) => c.coinObjectId);

//   const res = await subscribePrimary({
//     buyerMnemonic: mnemonics,
//     buyerKeypair: undefined,
//     buyerAddress: walletAddress,
//     seriesObjectId,
//     amountTenths,
//     paymentCoinIds,
//     bondId,
//     userId,
//   });

//   return {
//     ...res,
//     subscribedTenths: amountTenths,
//     subscribedHuman: formatBtnFromTenths(amountTenths),
//   };
// }



// ---------- Human-friendly BTN/BTNC formatting (tenths -> string) ----------

function tenthsToNumber(tenths: number | string | bigint): number {
    if (typeof tenths === "bigint") return Number(tenths) / 10;
    return Number(tenths) / 10;
}

const nfBTN = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

/** Format raw tenths (e.g. 1234) as "123.4" with Indian-style commas */
function formatBtnFromTenths(tenths: number | string | bigint): string {
    return nfBTN.format(tenthsToNumber(tenths));
}
