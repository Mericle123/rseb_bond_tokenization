"use server";

import { generateSalt, hashPassword } from "@/server/core/passwordHasher";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { createUserSession } from "@/server/core/session";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { comparePassword } from "@/server/core/passwordHasher";
import { removeUserFromSession } from "@/server/core/session";
import { redirect } from "next/navigation";
import { walletGeneration } from "../cryptography/keypair";
import dayjs from 'dayjs';
import { writeKycOnChain } from "../lib/blockchain";
import crypto  from  "crypto"

export async function registerUser(formData: FormData) {
  const national_id = Number(formData.get("national_id"));
  const email = formData.get("email") as string;
  const name = formData.get("name") as string
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const salt = generateSalt();
  const existing = await db.users.findUnique({ where: { email } });
  const dob = formData.get("dob") as string

  if (existing) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hashPassword(password, salt);

  try{
  const user = await db.users.create({
    data: {
      national_id,
      name,
      date_of_birth: new Date(dob),
      // wallet_address, 
      email,
      password: hashedPassword,
      salt,
      role,
      // hashed_mnemonic
    },
  });

  await createUserSession(user, await cookies());
  await completeVerification(user.id, user.national_id,  user.date_of_birth)
  return { success: true };
} catch(error) {
  console.log(error)
  return "Unable To create account"
}
}

export async function completeVerification(
  userId : string,
  nationalId : bigint,
  dateOfBirth : Date | null

) {

  const walletGenerate = await walletGeneration()
  const wallet_address = walletGenerate.suiAddress
  const hashed_mnemonic = walletGenerate.encryptedMnemonic


  // const session = sessions.get(requestId);
  // if (!session) throw new Error('Invalid requestId');

  const computedAge = dayjs().diff(dayjs(dateOfBirth), 'year');
  const age = computedAge;
  
  if (age < 18) {
    throw new Error("Not Legal");
  }

  const ndiHashHex = crypto.createHash('sha256').update(nationalId.toString()).digest('hex');
  const ndiHashBytes = Buffer.from(ndiHashHex, 'hex');
  const { suiAddress: custodialAddress } = walletGenerate

  const digest = await writeKycOnChain({ userAddress: custodialAddress, age, ndiHashBytes });
  console.log("kycdigest: ", digest)
  // session.state = 'verified';
  // session.age = age;
  // session.txDigest = digest;
  // session.custodialAddress = custodialAddress;
  // session.ndiHashHex = ndiHashHex;

  await db.eKYCVerifications.create({
  data: {
    user_id: userId,
    national_id_hash: ndiHashHex,
    date_of_birth: new Date(dateOfBirth),
    age,
    custodial_address: custodialAddress,
    tx_digest: digest,
    status: 'verified'
  },
});
    await db.users.update({
    where: { id: userId },
    data: { kyc_status: 'verified',
      wallet_address: wallet_address,
      hashed_mnemonic: hashed_mnemonic
     },
});


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