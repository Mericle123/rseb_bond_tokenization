import sessions from "../../lib/session";

export async function getSessionById({rid}) {
  const session = sessions.get(rid);
  if (!session) {
    return { success: false, error: "not_found" };
  }
  return { success: true, session };
}


import { completeVerification } from "../../lib/verification";

export async function simulateScan(requestId: string, age, userId) {
  try {
    if (!requestId) {
      return { success: false, error: "missing_requestId" };
    }

    await completeVerification({
      requestId,
      userId,
      nationalId: "DEV-NDI-0000",
      dateOfBirth: "2000-01-01",
      ageOverride: age,
    });
    return { success: true };
  } catch (e) {
    console.error("simulateScan error:", e);
    return { success: false, error: "simulate_failed" };
  }
}
