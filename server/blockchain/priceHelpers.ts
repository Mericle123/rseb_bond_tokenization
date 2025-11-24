// -----------------------------
// Price helpers (approx)
// -----------------------------
function primaryPrice(faceValue: number, amountTenths: number) {
  // face_value * tenths / 10
  return Math.floor((faceValue * amountTenths) / 10);
}

export function secondaryPrice(
  faceValue: number,
  rateBps: number,
  startMs: number,
  nowMs: number,
  amountTenths: number
) {
  const face = primaryPrice(faceValue, amountTenths);
  if (face === 0) return 0;
  const msPerDay = 86_400_000;
  const days = nowMs > startMs ? Math.floor((nowMs - startMs) / msPerDay) : 0;
  const num = BigInt(face) * BigInt(rateBps) * BigInt(days);
  const denom = BigInt(10_000) * BigInt(365);
  const interest = (num + denom - BigInt(1)) / denom;
  return Number(BigInt(face) + interest);
}