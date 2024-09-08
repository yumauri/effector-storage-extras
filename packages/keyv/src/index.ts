import type { Subscription } from 'effector'
import type {
  ConfigPersist as BaseConfigPersist,
  ConfigStore as BaseConfigStore,
  ConfigSourceTarget as BaseConfigSourceTarget,
  StorageAdapter,
} from 'effector-storage'
import type { Keyv, KeyvOptions, KeyvStoreAdapter } from 'keyv'
import type { KeyvStorageConfig } from './adapter'
import { persist as base } from 'effector-storage'
import { keyv } from './adapter'

export type {
  Done,
  Fail,
  Finally,
  StorageAdapter,
  StorageAdapterFactory,
} from 'effector-storage'
export type { KeyvStorageConfig }

export interface ConfigPersist extends BaseConfigPersist {
  with?: Keyv | KeyvStoreAdapter | KeyvOptions | Map<any, any>
  ttl?: number
}

export interface ConfigStore<State, Err = Error>
  extends KeyvStorageConfig,
    BaseConfigStore<State, Err> {}

export interface ConfigSourceTarget<State, Err = Error>
  extends KeyvStorageConfig,
    BaseConfigSourceTarget<State, Err> {}

export interface Persist {
  <State, Err = Error>(config: ConfigSourceTarget<State, Err>): Subscription
  <State, Err = Error>(config: ConfigStore<State, Err>): Subscription
}

/**
 * Creates `Keyv` adapter
 */
adapter.factory = true as const
export function adapter(config?: KeyvStorageConfig): StorageAdapter {
  return keyv({ ...config })
}

/**
 * Creates custom partially applied `persist`
 * with predefined `Keyv` adapter
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
