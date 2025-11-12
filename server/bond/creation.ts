"use server"

import { BondType, Status } from "@/generated/prisma";
import { Param } from "@/generated/prisma/runtime/library";
import { db } from "@/server/db";
import { success } from "zod";
import { id } from "zod/v4/locales";
import { mintBond } from "../blockchain/bond";
import { transBtn } from "../blockchain/btnc";

export async function bondCreation(formData: FormData) {
    const bond_name = formData.get("bondName") as string
    const face_value = formData.get("face_value") as string
    const maturityStr = formData.get("maturity") as string
    const interest_rate = formData.get("interest_rate") as string
    const bond_type = formData.get("bond_type") as BondType
    const bond_symbol = formData.get("bondSymbol2")  as string
    const organization_name  = formData.get("org_name")as string
    const purpose = formData.get("purpose")  as string
    const tl_unit = formData.get("totalUnitOffered") as string

    const sub_period = formData.get("subscription_period") as string
    const subscription_period = Number(sub_period)

    const maturity =  new  Date(maturityStr)
    
    const tl_unit_offered = Number(tl_unit)
    const face_v = Number(face_value)

 
    try {
        const trans = await mintBond({symbol : bond_symbol, name: bond_name, faceValue: face_v,rateBps : interest_rate, tenureDays: 25, issuerAddress: "0xd6b57889a695d0092c9393ee3c9da9f0a4e48460366f2892f7f4303bf65a29c8", startMs: 26, totalSupplyTenths : tl_unit_offered})
        const series_obj_id = trans;

        console.log(series_obj_id)

        const now = new Date()
        const endDate = new Date(now.getTime() + subscription_period * 24 * 60 * 60 * 1000);

        const bond = await db.bonds.create({
            data: {
                bond_object_id : series_obj_id,
                bond_type,
                bond_symbol,
                organization_name,
                bond_name,
                face_value: face_v,
                tl_unit_offered,
                tl_unit_subscribed: 0,
                maturity,
                status: "open",
                interest_rate,
                purpose,
                market: "current",
                subscription_period,
                subscription_end_date: endDate
            }
        }
        )

        if (!bond) {
            throw new Error("Bond Creation Failed")
        }
        return { success: true }
    }
    catch (error) {
        throw error
    }
}

export async function fetchBond(){
    try{
        const bonds = await db.bonds.findMany()

        if(!bonds){
            return {error: "No Bonds found"}
        }
        return bonds
    }
    catch(error){
        console.log(error)
        return "No Bonds found"
    }
}


export  async function fetchBondById(bondId){
    try{
        const bond = await db.bonds.findUnique({where: {id: bondId}})
        if(!bond){
            return("Such bond doesnt  exist")
        }
        return bond
    }
    catch(error){
        console.log(error)
        return "No such bond found"
    }

}

export async function subscribeToBond(bondId: string, { userId, walletAddress, mnemonics, toAddress,  committed_amount, subscription_amt}: any) {
  const tx = await transBtn({mnemonics, sender : walletAddress, toAddress, amountBTNC : committed_amount})
  if(!tx){
    return ("Transaction Error")
  }
  console.log("transaction: ", tx)
  const tx_hash = tx.txDigest
  return  await  db.$transaction(async (tx) => {
    const subscription = await tx.subscriptions.create({
        data: {
            wallet_address: walletAddress,
            committed_amount: Number(committed_amount),
            subscription_amt: Number(subscription_amt),
            tx_hash: tx_hash,
            
            bond: {
                connect: { id: bondId }, // 👈 this line fixes "Argument `bond` is missing"
            },
            user: {
                connect: {id: userId}
            }
            },
    })
     await tx.bonds.update({
        where: {id: bondId},
        data:{
            tl_unit_subscribed: {
                increment: Number(subscription_amt),
            },
        },

  })
  })

 
  
}
