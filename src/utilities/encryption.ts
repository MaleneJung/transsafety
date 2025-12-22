export const ENCRYPTION = {
  sha256Hex: async (str: string) => {
    const msgUint8 = new TextEncoder().encode(str)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  },
  iterativeHashingHex: {
    encrypt: async (str: string, key: string): Promise<string> => '',
    decrypt: async (str: string, key: string): Promise<string> => '',
  },
}
