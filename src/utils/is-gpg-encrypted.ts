export function isGpgEncrypted(text: string | Uint8Array): boolean {
  if (text instanceof Uint8Array) {
    return true;
  }
  return text.startsWith('-----BEGIN PGP MESSAGE-----');
}
