import type { StorageAdapter } from 'effector-storage'
import type { KeyvOptions, KeyvStoreAdapter } from 'keyv'
import Keyv from 'keyv'

export interface KeyvStorageConfig {
  with?: Keyv | KeyvStoreAdapter | KeyvOptions | Map<any, any>
  ttl?: number
}

/**
 * Creates `Keyv` adapter
 */
keyv.factory = true as const
export function keyv({ with: keyv, ttl }: KeyvStorageConfig): StorageAdapter {
  const store =
    keyv instanceof Keyv //
      ? keyv
      : new Keyv(keyv)

  // should add listener?
  // if there is a listener added, `set` will not throw an error on symbols
  // (promise will be resolved without errors), but emit this event instead
  // store.on('error', (err) => {})

  const adapter: StorageAdapter = <State>(key: string) => ({
    async get() {
      return await store.get(key)
    },

    async set(value: State) {
      return await store.set(key, value, ttl)
    },
  })

  adapter.keyArea = keyv
  return adapter
}
