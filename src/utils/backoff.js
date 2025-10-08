// Backoff helper utilities
export function nextDelayMs(attempt = 0, base = 1000, max = 60000) {
  const exp = Math.min(base * Math.pow(2, attempt), max);
  return Math.floor(Math.random() * exp); // full jitter
}

export function retryAfterToMs(response) {
  if (!response || !response.headers) return null;
  const ra = response.headers.get('retry-after');
  if (!ra) return null;
  const n = Number(ra);
  if (!Number.isNaN(n)) return n * 1000;
  const date = Date.parse(ra);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return null;
}

export default { nextDelayMs, retryAfterToMs };
