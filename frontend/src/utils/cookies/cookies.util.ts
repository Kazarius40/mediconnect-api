// export interface CookieOptions {
//   maxAge?: number;
//   sameSite?: 'Lax' | 'Strict' | 'None';
//   secure?: boolean;
//   path?: string;
//   domain?: string;
// }
//
// export function setCookie(
//   name: string,
//   value: string,
//   options: CookieOptions = {},
// ) {
//   if (typeof document === 'undefined') return;
//   let cookieStr = `${name}=${encodeURIComponent(value)};`;
//
//   cookieStr += ` path=${options.path ?? '/'};`;
//
//   // max-age
//   if (options.maxAge !== undefined) {
//     cookieStr += ` max-age=${options.maxAge};`;
//   }
//
//   // sameSite
//   if (options.sameSite) {
//     cookieStr += ` SameSite=${options.sameSite};`;
//   }
//
//   // secure
//   if (options.secure) {
//     cookieStr += ` Secure;`;
//   }
//
//   // domain
//   if (options.domain) {
//     cookieStr += ` Domain=${options.domain};`;
//   }
//
//   document.cookie = cookieStr.trim();
// }
//
// export function clearCookie(name: string, path: string = '/') {
//   setCookie(name, '', { path, maxAge: 0 });
// }
