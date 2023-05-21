import { vi, expect, test } from 'vitest'
import { createStore } from 'effector'
import { encrypted, persist } from '../src'

// Mock `react-native`.NativeModules.RNEncryptedStorage
// @see https://github.com/emeraldsanto/react-native-encrypted-storage/blob/master/src/__mocks__/react-native.js
// by default vitest uses 'main' field when resolve 'react-native-encrypted-storage', I don't know why,
// so, in order to use vi.mock, 'react-native-encrypted-storage' also needs to be patched (see root package.json)
vi.mock('react-native', () => {
  return {
    NativeModules: {
      RNEncryptedStorage: {
        setItem: vi.fn(() => Promise.resolve()),
        getItem: vi.fn(() => Promise.resolve('{ "foo": 1 }')),
        removeItem: vi.fn(() => Promise.resolve()),
        clear: vi.fn(() => Promise.resolve()),
      },
    },
  }
})

test('should export adapter and `persist` function', () => {
  expect(persist).toBeTypeOf('function')
  expect(encrypted).toBeTypeOf('function')
})

test('should be ok on good parameters', () => {
  const $store = createStore(0, { name: 'rnencrypted::store-0' })
  expect(() => persist({ store: $store })).not.toThrowError()
})
