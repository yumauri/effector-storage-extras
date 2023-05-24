import { vi, expect, test } from 'vitest'
import { createStore } from 'effector'
import { persist, either, log } from 'effector-storage'
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
