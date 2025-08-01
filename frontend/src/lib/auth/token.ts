export function decodeJwt<T = { exp: number }>(token: string): T | null {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(
  token: string,
  thresholdSeconds = 30,
): boolean {
  const payload = decodeJwt<{ exp: number }>(token);
  if (!payload?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp - currentTime < thresholdSeconds;
}
