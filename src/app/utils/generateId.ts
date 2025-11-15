import crypto from "crypto";

/**
 * Generate a compact unique id.
 * Format: [prefix_]<timestampInBase36><randomHex>
 * - prefix (optional) helps identify type (e.g. "USR", "JOB")
 * - size controls length of random hex part (default 8)
 */
export function generateId(prefix?: string, size = 8): string {
  const randomHex = crypto
    .randomBytes(Math.ceil(size / 2))
    .toString("hex")
    .slice(0, size);

  const tsBase36 = Date.now().toString(36);

  return prefix ? `${prefix}_${tsBase36}${randomHex}` : `${tsBase36}${randomHex}`;
}

export default generateId;