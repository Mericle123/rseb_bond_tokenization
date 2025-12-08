"use client";

import { useCurrentUser } from "@/context/UserContext";
import { getSessionById, simulateScan } from "@/server/ndiVerification/[rid]/simulation";
import { generateLoginQR } from "@/server/ndiVerification/start";
import { useState, useEffect, useRef } from "react";

// Polling hook
function usePolling(requestId?: string) {
  const [status, setStatus] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!requestId) return;

    async function poll() {
      try {
        const data = await getSessionById(requestId)
        setStatus(data);
        if (data.session.state === "PENDING") {
          timerRef.current = setTimeout(poll, 2000);
        }
      } catch {
        timerRef.current = setTimeout(poll, 3000);
      }
    }
    poll();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [requestId]);

  return status;
}

// QR Login component
export default function QRLoginPage() {
  const currentUser = useCurrentUser()

  const [user, setUser] = useState(currentUser)

  const [qr, setQr] = useState<string | null>(null);
  const [rid, setRid] = useState<string | null>(null);
  const status = usePolling(rid || undefined);

  async function start() {
    const data = await generateLoginQR();
    setQr(data.qrPng);
    setRid(data.requestId);
  }

  async function simulate(age = 22) {
    if (!rid) return;
    await simulateScan(rid, age, user.userId)
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>

      {!qr && <button onClick={start}>Generate QR</button>}

      {qr && (
        <>
          <img
            src={qr}
            alt="Scan with NDI app"
            style={{ width: 200, height: 200, marginTop: 12 }}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
            <button onClick={() => simulate(22)}>Simulate Adult</button>
            <button onClick={() => simulate(16)}>Simulate Underage</button>
          </div>
          <p><b>RID:</b> {rid}</p>
          <p><b>Status:</b> {status?.state || "—"}</p>

          {status?.state === "VERIFIED" && (
            <div style={{ background: "#e6ffe6", padding: 10, borderRadius: 8 }}>
              <div><b>Custodial:</b> {status.custodialAddress}</div>
              <div><b>KYC Tx:</b> {status.txDigest}</div>
            </div>
          )}

          {status?.state === "ERROR" && (
            <div style={{ color: "#c00" }}>
              <b>Error:</b> {status.reason}
            </div>
          )}
        </>
      )}
    </main>
  );
}
