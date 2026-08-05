import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "sublime_admin_session";

export function getSessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD não está configurada no ambiente.");
  }
  return createHash("sha256").update(password).digest("hex");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) {
    return false;
  }

  const expected = getSessionToken();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, expectedBuffer);
}
