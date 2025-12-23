export const ENCRYPTION = {
  sha256Hex: async (str: string) => {
    const bytes = new TextEncoder().encode(str)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes)
    const hashBytes = new Uint8Array(hashBuffer)
    return ENCRYPTION.bytesToHex(hashBytes)
  },
  cycleBytes: (bytes: Uint8Array, key: Uint8Array, reverse: boolean): Uint8Array => {
    const output: number[] = []
    for (let i = 0; i < bytes.length; i++) {
      const cycle = key[i % key.length]!
      let byte = reverse ? bytes[i]! - cycle : bytes[i]! + cycle
      while (byte > 255) byte -= 256
      while (byte < 0) byte += 256
      output.push(byte)
    }
    return new Uint8Array(output)
  },
  bytesToHex: (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  },
  hexToBytes: (hex: string): Uint8Array => {
    return Uint8Array.from(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
  },
  iterativeHashingHex: {
    generateIterativeHashingKey: async (len: number, key: string): Promise<Uint8Array> => {
      let iterativeKey = ''
      let iterativeIndex = 0
      while (iterativeKey.length < len) {
        iterativeKey += await ENCRYPTION.sha256Hex(iterativeIndex + key)
        iterativeIndex++
      }
      return new TextEncoder().encode(iterativeKey)
    },
    encrypt: async (str: string, key: string): Promise<string> => {
      const bytes = new TextEncoder().encode(str)
      const iterativeKey = await ENCRYPTION.iterativeHashingHex.generateIterativeHashingKey(
        bytes.length,
        key,
      )
      const cycledBytes = ENCRYPTION.cycleBytes(bytes, iterativeKey, false)
      return ENCRYPTION.bytesToHex(cycledBytes)
    },
    decrypt: async (str: string, key: string): Promise<string> => {
      const bytes = ENCRYPTION.hexToBytes(str)
      const iterativeKey = await ENCRYPTION.iterativeHashingHex.generateIterativeHashingKey(
        bytes.length,
        key,
      )
      const cycledBytes = ENCRYPTION.cycleBytes(bytes, iterativeKey, true)
      return new TextDecoder().decode(cycledBytes)
    },
  },
}
