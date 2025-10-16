import { Status } from "@/generated/prisma";
import { db } from "../db";
import { success } from "zod";

export async function bondCreation(formData: FormData) {
    const bond_object_id = formData.get("bond_object_id") as string
    const name = formData.get("name") as string
    const face_value = formData.get("face_value") as string
    const price = formData.get("price") as string
    const maturity = formData.get("maturity") as string
    const status = formData.get("status") as Status
    const interest_rate = formData.get("interest_rate") as string

    const face_v = Number(face_value)
    const price_numb = Number(price)

    try {
        const bond = await db.bonds.create({
            data: {
                bond_object_id,
                name,
                face_value: face_v,
                price: price_numb,
                maturity,
                status,
                interest_rate
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