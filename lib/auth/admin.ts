import crypto from "crypto";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || "";
}

/**
 * Generate a cryptographically signed session token for admin
 */
export function createAdminSessionToken(): string {
  const secret = getAdminSecret();
  if (!secret) return "";
  const payload = `admin_session_${Math.floor(Date.now() / 1000)}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verify an admin session token
 */
export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const secret = getAdminSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Check if a raw password matches the ADMIN_SECRET_KEY
 */
export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret || !password) return false;

  try {
    const passBuf = Buffer.from(password.trim());
    const secretBuf = Buffer.from(secret.trim());
    if (passBuf.length !== secretBuf.length) return false;
    return crypto.timingSafeEqual(passBuf, secretBuf);
  } catch {
    return false;
  }
}

/**
 * Verify an incoming API Request has valid Admin credentials (via cookie or header)
 */
export function verifyAdminRequest(req: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  // 1. Check Header (x-admin-key or Bearer token)
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (verifyAdminPassword(token) || verifyAdminSessionToken(token)) {
      return true;
    }
  }

  // 2. Check Cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/whosbidding_admin_session=([^;]+)/);
  if (match && match[1]) {
    return verifyAdminSessionToken(decodeURIComponent(match[1]));
  }

  return false;
}
