import { vi, expect, test } from 'vitest'
import { createEvent, createStore } from 'effector'
import mock from 'mock-require'
import Keyv from 'keyv'
import { adapter, persist } from '../src'

async function tick(t = 10) {
  return await new Promise((resolve) => setTimeout(resolve, t))
}

// vitest cannot mock `require`, so use `mock-require` package instead,
// to mock '@keyv/redis' module
mock('@keyv/redis', function () {
  return new Map()
})

test('should export adapter and `persist` function', () => {
  expect(persist).toBeTypeOf('function')
  expect(adapter).toBeTypeOf('function')
})

test('should be ok on good parameters', () => {
  const $store = createStore(0, { name: 'store-0' })
  expect(() => persist({ store: $store })).not.toThrowError()
})

test('should be ok with uri', () => {
  const $store = createStore(0, { name: 'store-1' })
  expect(() =>
    persist({
      store: $store,
      with: 'redis://localhost:6379', // this will require mocked '@keyv/redis'
    })
  ).not.toThrowError()
})

test('should be ok with keyv instance', () => {
  const $store = createStore(0, { name: 'store-2' })
  expect(() =>
    persist({
      store: $store,
      with: new Keyv(),
    })
  ).not.toThrowError()
})

test('should be ok with keyv options', () => {
  const $store = createStore(0, { name: 'store-3' })
  expect(() =>
    persist({
      store: $store,
      with: {
        store: new Map(),
        namespace: 'keyv-test',
        ttl: 1000,
      },
    })
  ).not.toThrowError()
})

// I'm not sure, should this case throw an error,
// or handle it with `supports` function and return `nil` adapter?
test('should throw an error on absent adapter module', () => {
  const $store = createStore(0, { name: 'store-4' })
  expect(() =>
    persist({
      store: $store,
      with: 'sqlite://path/to/database.sqlite',
    })
  ).toThrowError(`Cannot find module '@keyv/sqlite'`)
})

test('should restore value from keyv', async () => {
  const map = new Map()
  map.set('test:answer', '{"value":42,"expires":null}')

  const $answer = createStore<number | null>(null)
  persist({
    store: $answer,
    key: 'answer',
    with: {
      store: map,
      namespace: 'test',
    },
  })

  await tick()
  expect($answer.getState()).toBe(42)
})

test('should persist value in keyv', async () => {
  const keyv = new Keyv()

  const $answer = createStore<number | null>(null)
  persist({
    store: $answer,
    key: 'answer',
    with: keyv,
  })

  // set new value
  ;($answer as any).setState(42)

  await tick()
  const value = await keyv.get('answer')
  expect(value).toBe(42)
})

test('shoulh handle error from keyv', async () => {
  const map = new Map()
  const keyv = new Keyv({ store: map })

  const watch = vi.fn()
  const fail = createEvent<any>()
  fail.watch(watch)

  const $symbol = createStore<symbol | null>(null)
  persist({
    store: $symbol,
    key: 'symbol',
    with: keyv,
    fail,
  })

  // set new value
  const v = Symbol('test')
  ;($symbol as any).setState(v)

  await tick()
  expect(watch.mock.calls.length).toBe(1)
  const { error, value, ...rest } = watch.mock.calls[0][0]
  expect(rest).toEqual({
    key: 'symbol',
    keyPrefix: '',
    operation: 'set',
  })
  expect(error.context).toBe('symbol cannot be serialized')
  expect(value).toBe(v)
})
