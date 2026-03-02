import { createStore } from 'effector'
import { either, log, persist } from 'effector-storage'
import { expect, test, vi } from 'vitest'
import { adapter } from '../src'

test('should be nil adapter', async () => {
  const logger = vi.fn()

  const $counter = createStore(0)
  persist({
    store: $counter,
    key: 'counter::unsupported',
    adapter: either(adapter, log({ logger })),
  })

  expect(logger.mock.calls).toEqual([
    ['[log adapter] get value for key "counter::unsupported"'],
  ])
})
