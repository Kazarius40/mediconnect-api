export interface CookieOptions {
  maxAge?: number;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
  path?: string;
  domain?: string;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  if (typeof document === 'undefined') return;
  let cookieStr = `${name}=${encodeURIComponent(value)}; path=${options.path ?? '/'}`;

  if (options.maxAge !== undefined) {
    cookieStr += `; max-age=${options.maxAge}`;
  }
  if (options.sameSite) {
    cookieStr += `; SameSite=${options.sameSite}`;
  }
  if (options.secure) {
    cookieStr += '; Secure';
  }
  if (options.domain) {
    cookieStr += `; Domain=${options.domain}`;
  }

  document.cookie = cookieStr;
}
