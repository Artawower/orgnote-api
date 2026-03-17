const bytesToHex = (bytes: Uint8Array): string => {
  let hex = '';

  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0');
  }

  return hex;
};

let subtleCrypto: SubtleCrypto | null = null;

const getSubtleCrypto = (): SubtleCrypto => {
  if (subtleCrypto) {
    return subtleCrypto;
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is not available');
  }

  subtleCrypto = globalThis.crypto.subtle;
  return subtleCrypto;
};

export const hashContent = async (content: Uint8Array): Promise<string> => {
  const digest = await getSubtleCrypto().digest('SHA-256', content);
  return bytesToHex(new Uint8Array(digest));
};

export const hashBytes = hashContent;
