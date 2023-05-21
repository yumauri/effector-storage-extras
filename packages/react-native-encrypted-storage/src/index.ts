import type { Subscription } from 'effector'
import type {
  ConfigPersist as BaseConfigPersist,
  ConfigStore as BaseConfigStore,
  ConfigSourceTarget as BaseConfigSourceTarget,
  StorageAdapter,
} from 'effector-storage'
import { persist as base, asyncStorage } from 'effector-storage'
import EncryptedStorage from 'react-native-encrypted-storage'

export type { Done, Fail, Finally, StorageAdapter } from 'effector-storage'

export interface ConfigPersist extends BaseConfigPersist {}

export interface EncryptedStorageConfig {
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
}

export interface ConfigStore<State, Err = Error>
  extends EncryptedStorageConfig,
    BaseConfigStore<State, Err> {}

export interface ConfigSourceTarget<State, Err = Error>
  extends EncryptedStorageConfig,
    BaseConfigSourceTarget<State, Err> {}

export interface Persist {
  <State, Err = Error>(config: ConfigSourceTarget<State, Err>): Subscription
  <State, Err = Error>(config: ConfigStore<State, Err>): Subscription
}

/**
 * Creates `EncryptedStorage` adapter
 */
adapter.factory = true as const
export function adapter(config?: EncryptedStorageConfig): StorageAdapter {
  return asyncStorage({
    storage: () => EncryptedStorage,
    ...config,
  })
}

/**
 * Creates custom partially applied `persist`
 * with predefined `EncryptedStorage` adapter
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
