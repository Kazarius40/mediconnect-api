export function decodeJwt<T = any>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

let refreshTimerId: NodeJS.Timeout | null = null; // Внутрішня змінна для управління таймером

export function scheduleTokenRefresh(
  token: string,
  onRefresh: () => void,
  refreshBeforeMs = 2 * 60 * 1000, // За замовчуванням 2 хвилини до закінчення токена
): NodeJS.Timeout | null {
  // <-- ДОДАНО ТИП ПОВЕРНЕННЯ!
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }

  const decoded = decodeJwt<{ exp: number }>(token);
  if (!decoded?.exp) {
    console.warn(
      '[JWT Util] No expiration time found in token, cannot schedule refresh.',
    );
    return null; // Повертаємо null, якщо не можемо декодувати або немає exp
  }

  const expireTime = decoded.exp * 1000; // Час закінчення токена в мілісекундах
  const now = Date.now(); // Поточний час в мілісекундах
  const refreshTime = expireTime - refreshBeforeMs - now; // Час до спрацювання рефрешу

  if (refreshTime <= 0) {
    onRefresh();
    return null; // Повертаємо null, оскільки таймер не встановлюється
  }

  // Встановлюємо новий таймер і зберігаємо його ID
  refreshTimerId = setTimeout(onRefresh, refreshTime);
  return refreshTimerId; // <-- ПОВЕРТАЄМО ID ТАЙМЕРА!
}
