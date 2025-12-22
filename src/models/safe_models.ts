import type { SafeDataModel } from './safe_data_models'

export interface SafeLockedModel {
  name: string
  masterCheckPhrase: string
  encryptedData: string
}

export interface SafeUnlockedModel {
  name: string
  masterCheckPhrase: string
  masterSeed: string
  masterKey: string
  decryptedData: SafeDataModel
}

export interface SafeListModel {
  names: string[]
}
