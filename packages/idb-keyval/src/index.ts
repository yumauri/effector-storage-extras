import type { Subscription } from 'effector'
import type {
  ConfigPersist as BaseConfigPersist,
  ConfigStore as BaseConfigStore,
  ConfigSourceTarget as BaseConfigSourceTarget,
  StorageAdapter,
} from 'effector-storage'
import type { UseStore } from 'idb-keyval'
import type { IdbStorageConfig } from './adapter'
import { persist as base, nil } from 'effector-storage'
import { idbkeyval, keyArea } from './adapter'

export type {
  Done,
  Fail,
  Finally,
  StorageAdapter,
  StorageAdapterFactory,
} from 'effector-storage'
export type { IdbStorageConfig }

export interface ConfigPersist extends BaseConfigPersist {
  timeout?: number
  dbName?: string
  storeName?: string
  keyvalStore?: UseStore
}

export interface ConfigStore<State, Err = Error>
  extends IdbStorageConfig,
    BaseConfigStore<State, Err> {}

export interface ConfigSourceTarget<State, Err = Error>
  extends IdbStorageConfig,
    BaseConfigSourceTarget<State, Err> {}

export interface Persist {
  <State, Err = Error>(config: ConfigSourceTarget<State, Err>): Subscription
  <State, Err = Error>(config: ConfigStore<State, Err>): Subscription
}

/**
 * Function, checking if `IndexedDB` exists
 */
function supports() {
  // in case of blocked IndexedDB, `indexedDB` is available
  // and accessing it doesn't throw an error
  // (in contrast to `localStorage` and `sessionStorage`)
  // but opening a database WILL end up with an error
  return typeof indexedDB !== 'undefined'
}

/**
 * Creates `IndexedDB` adapter
 */
adapter.factory = true as const
export function adapter(config?: IdbStorageConfig): StorageAdapter {
  return supports()
    ? idbkeyval({
        ...config,
      })
    : nil({ keyArea })
}

/**
 * Creates custom partially applied `persist`
 * with predefined `IndexedDB` adapter
 */
export function createPersist(defaults?: ConfigPersist): Persist {
  return (config) =>
    base({
      adapter,
      ...defaults,
      ...config,
    })
}

/**
 * Default partially applied `persist`
 */
export const persist = createPersist()
