import { vi, expect, test, beforeEach, afterEach } from 'vitest'
import { createStore } from 'effector'
import Keyv from 'keyv'
import { persist } from '../src'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('should erase value after global ttl is expired', async () => {
  const keyv = new Keyv({ ttl: 1000 })

  const $ttl = createStore<number | null>(null)
  persist({
    store: $ttl,
    key: 'ttl',
    with: keyv,
  })

  // set new value
  ;($ttl as any).setState(333)

  await 0
  const value1 = await keyv.get('ttl')
  expect(value1).toBe(333)

  vi.advanceTimersByTime(2000)
  await 0
  const value2 = await keyv.get('ttl')
  expect(value2).toBe(undefined)
})

test('should not restore value after global ttl is expired', async () => {
  const map = new Map()
  const keyv = new Keyv({ store: map, ttl: 1000 })
  await keyv.set('ttl', 333)

  vi.advanceTimersByTime(2000)
  const value1 = JSON.parse(map.get('keyv:ttl'))
  expect(value1.value).toBe(333) // value is not erased yet

  const $ttl = createStore<number | null>(null)
  persist({
    store: $ttl,
    key: 'ttl',
    with: keyv,
  })

  await vi.runAllTimersAsync()
  expect(map.get('keyv:ttl')).toBe(undefined) // value is erased
  expect($ttl.getState()).toBe(null)
})

test('should erase value after local ttl is expired', async () => {
  const keyv = new Keyv()

  const $ttl = createStore<number | null>(null)
  persist({
    store: $ttl,
    key: 'ttl',
    with: keyv,
    ttl: 1000,
  })

  // set new value
  ;($ttl as any).setState(333)

  await 0
  const value1 = await keyv.get('ttl')
  expect(value1).toBe(333)

  vi.advanceTimersByTime(2000)
  await 0
  const value2 = await keyv.get('ttl')
  expect(value2).toBe(undefined)
})
