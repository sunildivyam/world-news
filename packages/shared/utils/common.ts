export function getRandomIntInclusive(min: number, max: number): number {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

export function getLocalHostNames(): string[] {
  return ["localhost", "127.0.0.1", "::1", "[::1]"];
}
/**
 * Checks if a host string refers to the local machine.
 * * Covers:
 * - 'localhost'
 * - IPv4 loopback (127.0.0.1)
 * - IPv6 loopback (::1 or [::1])
 * - Local TLDs (.local)
 */
export function isLocalHost(host: string): boolean {
  if (!host) return false;

  const lowercaseHost = host.toLowerCase().trim();

  return (
    lowercaseHost.includes("localhost") ||
    lowercaseHost === "localhost" ||
    lowercaseHost === "127.0.0.1" ||
    lowercaseHost === "::1" ||
    lowercaseHost === "[::1]" ||
    lowercaseHost.endsWith(".local")
  );
}
