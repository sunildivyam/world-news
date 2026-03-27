const memoryStore = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(key: string, limit: number) {
  const now = Date.now();

  const record = memoryStore.get(key);

  if (!record || record.reset < now) {
    memoryStore.set(key, { count: 1, reset: now + 60000 });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
