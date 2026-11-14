export const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** PIN -> AES key (PBKDF2). Must match scripts/make-vault.mjs */
export async function deriveKey(pin: string, saltB64: string, iterations: number) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b64(saltB64) as any, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
}

/** data = 12-byte IV + ciphertext + auth tag. Throws if the key (PIN) is wrong. */
export async function decryptBytes(key: CryptoKey, data: ArrayBuffer | Uint8Array): Promise<ArrayBuffer> {
  const u = data instanceof Uint8Array ? data : new Uint8Array(data);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) as any }, key, u.slice(12) as any);
}