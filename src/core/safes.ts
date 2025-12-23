import type { SafeListModel, SafeLockedModel, SafeUnlockedModel } from '@/models/safe_models'
import { ENCRYPTION } from '../utilities/encryption'
import type { SafeDataModel } from '@/models/safe_data_models'
import { exportTextToFile, importFilesToText } from '../utilities/file_io'

export async function loadLockedSafe(name: string): Promise<SafeLockedModel | undefined> {
  const asStr = localStorage.getItem(await localStorageSafeKey(name))
  if (!asStr) return undefined

  return JSON.parse(asStr)
}

export async function saveLockedSafe(lockedSafe: SafeLockedModel): Promise<void> {
  const asStr = JSON.stringify(lockedSafe)
  localStorage.setItem(await localStorageSafeKey(lockedSafe.name), asStr)
}

export async function localStorageSafeKey(name: string): Promise<string> {
  const nameHash = await ENCRYPTION.sha256Hex(name)
  return 'safe-by-hash.' + nameHash
}

export async function generateMasterCheckPhrase(masterPassword: string): Promise<string> {
  return await ENCRYPTION.sha256Hex('checkPhrase-' + masterPassword)
}

export async function generateMasterSeed(masterPassword: string): Promise<string> {
  return await ENCRYPTION.sha256Hex('seed-' + masterPassword)
}

export async function generateMasterKey(masterPassword: string): Promise<string> {
  return await ENCRYPTION.sha256Hex('key-' + masterPassword)
}

export async function validateMasterCheckphrase(
  masterCheckPhrase: string,
  masterPassword: string,
): Promise<boolean> {
  return (await generateMasterCheckPhrase(masterPassword)) == masterCheckPhrase
}

export async function unlockSafe(
  lockedSafe: SafeLockedModel,
  masterPassword: string,
): Promise<SafeUnlockedModel | undefined> {
  if (!(await validateMasterCheckphrase(lockedSafe.masterCheckPhrase, masterPassword)))
    return undefined

  const masterKey = await generateMasterKey(masterPassword)

  const decryptedDataAsStr = await ENCRYPTION.iterativeHashingHex.decrypt(
    lockedSafe.encryptedData,
    masterKey,
  )

  const decryptedData: SafeDataModel = JSON.parse(decryptedDataAsStr)
  const unlockedSafe: SafeUnlockedModel = {
    name: lockedSafe.name,
    masterCheckPhrase: lockedSafe.masterCheckPhrase,
    masterSeed: await generateMasterSeed(masterPassword),
    masterKey: masterKey,
    decryptedData: decryptedData,
  }

  return unlockedSafe
}

export async function lockSafe(unlockedSafe: SafeUnlockedModel): Promise<SafeLockedModel> {
  const decryptedDataAsStr = JSON.stringify(unlockedSafe.decryptedData)
  const encryptedData = await ENCRYPTION.iterativeHashingHex.encrypt(
    decryptedDataAsStr,
    unlockedSafe.masterKey,
  )
  const lockedSafe: SafeLockedModel = {
    name: unlockedSafe.name,
    masterCheckPhrase: unlockedSafe.masterCheckPhrase,
    encryptedData: encryptedData,
  }
  return lockedSafe
}

export async function loadUnlockedSafe(
  name: string,
  masterPassword: string,
): Promise<SafeUnlockedModel | undefined> {
  const asLocked = await loadLockedSafe(name)
  if (!asLocked) return undefined

  return await unlockSafe(asLocked, masterPassword)
}

export function loadSafeList(): SafeListModel {
  const asStr = localStorage.getItem('safe-list')
  let safeList: SafeListModel
  if (!asStr) {
    safeList = {
      names: [],
    }
    saveSafeList(safeList)
  } else {
    safeList = JSON.parse(asStr)
  }
  return safeList
}

export function saveSafeList(safeList: SafeListModel): void {
  const asStr = JSON.stringify(safeList)
  localStorage.setItem('safe-list', asStr)
}

const lockedSafeFileExt = '.transsafe.json'

export function exportLockedSafe(lockedSafe: SafeLockedModel): void {
  const asStr = JSON.stringify(lockedSafe)
  exportTextToFile(lockedSafe.name + lockedSafeFileExt, asStr)
}

export function pushLockedSafe(safeList: SafeListModel, lockedSafe: SafeLockedModel): void {
  if (!safeList.names.includes(lockedSafe.name)) {
    safeList.names.push(lockedSafe.name)
    saveSafeList(safeList)
  }
}

export function importLockedSafes(safeList: SafeListModel): void {
  importFilesToText(({}: number, fileName: string, fileContent: string) => {
    if (!fileName.endsWith(lockedSafeFileExt)) return
    const lockedSafe: SafeLockedModel = JSON.parse(fileContent)
    saveLockedSafe(lockedSafe).then(() => pushLockedSafe(safeList, lockedSafe))
  })
}

export async function createLockedSafe(
  safeList: SafeListModel,
  name: string,
  masterPassword: string,
): Promise<SafeLockedModel> {
  const unlockedSafe: SafeUnlockedModel = {
    name: name,
    masterCheckPhrase: await generateMasterCheckPhrase(masterPassword),
    masterKey: await generateMasterKey(masterPassword),
    masterSeed: await generateMasterSeed(masterPassword),
    decryptedData: {
      credentials: [],
      transformers: [],
    },
  }

  const lockedSafe = await lockSafe(unlockedSafe)

  await saveLockedSafe(lockedSafe)
  pushLockedSafe(safeList, lockedSafe)

  return lockedSafe
}
