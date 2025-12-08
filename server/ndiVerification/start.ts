import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import sessions from "../lib/session";

const PORT = process.env.PORT || 3000;

export async function generateLoginQR() {
  try {
    const requestId = uuidv4();
    sessions.set(requestId, { createdAt: Date.now(), state: "PENDING" });

    const redirectUri =
      process.env.NDI_REDIRECT_URI ||
      `http://localhost:${PORT}/api/auth/callback`;

    const deeplink = `bbp://ndi/login?request_id=${requestId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    const qrPng = await QRCode.toDataURL(deeplink);

    return {
      success: true,
      requestId,
      deeplink,
      qrPng,
    };
  } catch (err) {
    console.error("generateLoginQR error:", err);
    return {
      success: false,
      error: "qr_start_failed",
    };
  }
}
