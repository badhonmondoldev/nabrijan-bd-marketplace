interface RateLimitStore {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitStore>();

/**
 * Lightweight sliding-window rate limiter
 * @param key Unique key per IP / route (e.g., login:127.0.0.1)
 * @param limit Max allowed attempts in window
 * @param windowMs Window duration in milliseconds (default 15 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || now > record.resetAt) {
    tracker.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}
