import { expect, test } from 'vitest'
import { createStore } from 'effector'
import { adapter, persist } from '../src'

test('should export adapter and `persist` function', () => {
  expect(persist).toBeTypeOf('function')
  expect(adapter).toBeTypeOf('function')
})

test('should be ok on good parameters', () => {
  const $store = createStore(0, { name: 'idb-keyval::store-0' })
  expect(() => persist({ store: $store })).not.toThrowError()
})
