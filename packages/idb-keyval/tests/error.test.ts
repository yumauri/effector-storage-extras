import 'fake-indexeddb/auto'
import { vi, expect, test } from 'vitest'
import { createEvent, createStore } from 'effector'
import { persist } from '../src'

async function tick(t = 10) {
  return await new Promise((resolve) => setTimeout(resolve, t))
}

test('should fail on same db name with different store names', async () => {
  const watch = vi.fn()
  const fail = createEvent<any>()
  fail.watch(watch)

  persist({
    store: createStore(0),
    dbName: 'idb',
    storeName: 'store1',
    key: 'counter::batch',
    fail,
  })

  persist({
    store: createStore(0),
    dbName: 'idb',
    storeName: 'store2',
    key: 'counter::batch',
    fail,
  })

  await tick() // wait for IndexedDB to restore value
  expect(watch.mock.calls).toEqual([
    [
      {
        error: expect.any(Error),
        key: 'counter::batch',
        keyPrefix: '',
        operation: 'get',
        value: undefined,
      },
    ],
  ])
  expect(String(watch.mock.calls[0][0].error)).toMatch(
    /No objectStore named store2 in this database/
  )
})
