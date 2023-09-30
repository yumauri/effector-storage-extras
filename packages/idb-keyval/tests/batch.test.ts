import 'fake-indexeddb/auto'
import { vi, expect, test } from 'vitest'
import { createStore } from 'effector'
import { get, set, setMany } from 'idb-keyval'
import { persist } from '../src'

vi.mock('idb-keyval', async (importOriginal) => {
  const mod: any = await importOriginal()
  return {
    ...mod,
    set: vi.fn(mod.set),
    setMany: vi.fn(mod.setMany),
  }
})

async function tick(t = 10) {
  return await new Promise((resolve) => setTimeout(resolve, t))
}

test('should batch writes to IndexedDB', async () => {
  const $counter = createStore(0)
  persist({
    store: $counter,
    key: 'counter::batch',
    timeout: 0,
  })

  expect(await get('counter::batch')).toBeUndefined()

  // set new values
  for (let i = 1; i <= 100; i++) {
    ;($counter as any).setState(i)
  }

  await tick() // wait for IndexedDB to persist value
  expect(await get('counter::batch')).toBe(100)

  expect((set as any).mock.calls.length).toBe(0)
  expect((setMany as any).mock.calls.length).toBe(1)
})
