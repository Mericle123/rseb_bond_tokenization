"use server";

import { generateSalt, hashPassword } from "@/server/core/passwordHasher";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { createUserSession } from "@/server/core/session";
import { cookies } from "next/headers";
import { Role } from "@/generated/prisma";
import { comparePassword } from "@/server/core/passwordHasher";
import { removeUserFromSession } from "@/server/core/session";
import { redirect } from "next/navigation";
import { walletGeneration } from "../cryptography/keypair";


export async function registerUser(formData: FormData) {
  const national_id = Number(formData.get("national_id"));
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const salt = generateSalt();
  const existing = await db.users.findUnique({ where: { email } });

  if (existing) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hashPassword(password, salt);

  const walletGenerate = await walletGeneration()
  const wallet_address = walletGenerate.suiAddress
  console.log("walletAddress: ",wallet_address)
  const hashed_mnemonic = walletGenerate.encryptedMnemonic
  console.log("Mnemonic: ", hashed_mnemonic)

  try{
  const user = await db.users.create({
    data: {
      national_id,
      wallet_address, 
      email,
      password: hashedPassword,
      salt,
      role,
      hashed_mnemonic
    },
  });

  await createUserSession(user, await cookies());
 
  return { success: true };
} catch(error) {
  console.log(error)
  return "Unable To create account"
}
}


export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;  

  const existing = await db.users.findUnique({ where: { email } });

  if (!existing){
    return {error: "User does not exists"}
  }

  if (!existing.password) {
    return { error: "Password not set for this user" };
  }
  
const  isPasswordValid = await comparePassword({
  hashedPassword : existing.password,
  password : password,
  salt : existing.salt
})

  if (!isPasswordValid) {
    return { error: "Invalid password" };
  }
  await createUserSession(existing, await cookies())
  if(existing.role == "user"){
    redirect("/investor")
  }
  else{
    redirect("/admin")
  }
}
 

export async function logout(){
  await removeUserFromSession(await cookies())
  redirect("/")
}