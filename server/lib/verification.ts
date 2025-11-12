"use server"

import dayjs from 'dayjs';
import crypto from 'crypto';
import sessions from './session';
import { walletGeneration } from '../cryptography/keypair';
import { writeKycOnChain } from './blockchain';
import { db } from "@/server/db"

export async function completeVerification({
  requestId,
  userId,
  nationalId,
  dateOfBirth,
  ageOverride,
}: {
  requestId: string;
  userId: string,
  nationalId: string;
  dateOfBirth: string;
  ageOverride?: number;
}) {
  const session = sessions.get(requestId);
  if (!session) throw new Error('Invalid requestId');

  const computedAge = dayjs().diff(dayjs(dateOfBirth), 'year');
  const age = Number.isFinite(ageOverride) ? ageOverride : computedAge;
  
  if (age < 18) {
    session.state = 'ERROR';
    session.reason = 'UNDERAGE';
    session.age = age;
    return;
  }

  const ndiHashHex = crypto.createHash('sha256').update(nationalId).digest('hex');
  const ndiHashBytes = Buffer.from(ndiHashHex, 'hex');
  const { suiAddress: custodialAddress } = await walletGeneration();

  const digest = await writeKycOnChain({ userAddress: custodialAddress, age, ndiHashBytes });
  console.log("kycdigest: ", digest)
  session.state = 'verified';
  session.age = age;
  session.txDigest = digest;
  session.custodialAddress = custodialAddress;
  session.ndiHashHex = ndiHashHex;

  await db.eKYCVerifications.create({
  data: {
    user_id: userId,
    national_id_hash: ndiHashHex,
    date_of_birth: new Date(dateOfBirth),
    age,
    custodial_address: custodialAddress,
    tx_digest: digest,
    status: 'verified',
    request_id: requestId,
  },
});

    await db.users.update({
    where: { id: userId },
    data: { kyc_status: 'verified' },
});


}
