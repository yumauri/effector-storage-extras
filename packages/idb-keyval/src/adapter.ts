import type { StorageAdapter } from 'effector-storage'
import type { UseStore } from 'idb-keyval'
import { get, set, setMany, createStore } from 'idb-keyval'

export interface IdbStorageConfig {
  timeout?: number
  dbName?: string
  storeName?: string
  keyvalStore?: UseStore
}

export const keyArea = Symbol() // eslint-disable-line symbol-description
const keyvalStores: Map<string, UseStore> = new Map()

const buffer: Map<
  UseStore | undefined,
  [
    number | undefined, // timeoutId
    number | undefined, // scheduled
    Map<string, any>
  ]
> = new Map()

/**
 * Flush buffer to actual IndexedDB store
 */
function flush(to: UseStore) {
  const meta = buffer.get(to)
  if (meta) {
    setMany([...meta[2].entries()], to)
    buffer.delete(to)
  }
}

/**
 * Creates `IndexedDB` adapter
 */
idbkeyval.factory = true as const
export function idbkeyval({
  timeout,
  dbName,
  storeName,
  keyvalStore,
}: IdbStorageConfig): StorageAdapter {
  const key = dbName + '|' + storeName

  let store: UseStore | undefined = keyvalStores.get(key) || keyvalStore
  if (dbName && storeName && !store) {
    store = createStore(dbName, storeName)
    keyvalStores.set(key, store)
  }

  const adapter: StorageAdapter = <State>(key: string) => ({
    async get() {
      return await get(key, store)
    },

    async set(value: State) {
      if (timeout === undefined) {
        return await set(key, value, store)
      }

      const [timeoutId, scheduled, buffered] = buffer.get(store) || [
        undefined,
        undefined,
        new Map(),
      ]
      buffered.set(key, value)

      const deadline = Date.now() + timeout
      if (scheduled === undefined || scheduled > deadline) {
        clearTimeout(timeoutId)
        buffer.set(store, [
          setTimeout(flush, timeout, store), // new timeoutId
          deadline, // new scheduled
          buffered, // old buffered with new/replaced key:value
        ])
      }
    },
  })

  adapter.keyArea = store || keyArea
  return adapter
}
