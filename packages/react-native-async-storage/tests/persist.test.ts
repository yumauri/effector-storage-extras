import { vi, expect, test } from 'vitest'
import { createStore } from 'effector'
import { async, persist } from '../src'

// Mock AsyncStorage
// @see https://react-native-async-storage.github.io/async-storage/docs/advanced/jest
// this mock depends on global `jest` variable to define all methods using `jest.fn()`,
// see source code: https://github.com/react-native-async-storage/async-storage/blob/master/jest/async-storage-mock.js
// so it cannot be mocked using `__mocks__` folder :(
vi.mock('@react-native-async-storage/async-storage', async () => {
  // declare `vi` as global `jest` variable, so mock will call `vi.fn()` instead of `jest.fn()`
  ;(global as any).jest = vi
  const AsyncStorageMock = await import(
    '@react-native-async-storage/async-storage/jest/async-storage-mock'
  )
  return AsyncStorageMock
})

test('should export adapter and `persist` function', () => {
  expect(persist).toBeTypeOf('function')
  expect(async).toBeTypeOf('function')
})

test('should be ok on good parameters', () => {
  const $store = createStore(0, { name: 'rnasync::store-0' })
  expect(() => persist({ store: $store })).not.toThrowError()
})
