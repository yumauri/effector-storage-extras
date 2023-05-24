import { vi, expect, test } from 'vitest'
import { createStore } from 'effector'
import { openDB } from 'idb'
import { createStore as createIdbKeyvalStore, get, set } from 'idb-keyval'
import { adapter, persist } from '../src'

// Mock IndexedDB
vi.hoisted(async () => {
  await import('fake-indexeddb/auto')
})

function getter(dbName: string, storeName: string, key: string) {
  return async () => {
    const db = await openDB(dbName, undefined, {
      upgrade(db) {
        db.createObjectStore(storeName)
      },
    })
    const value = await db.get(storeName, key)
    return value
  }
}

function setter(dbName: string, storeName: string, key: string) {
  return async (value: any) => {
    const db = await openDB(dbName, undefined, {
      upgrade(db) {
        db.createObjectStore(storeName)
      },
    })
    await db.put(storeName, value, key)
  }
}

async function tick(t = 10) {
  return await new Promise((resolve) => setTimeout(resolve, t))
}

test('should export adapter and `persist` function', () => {
  expect(persist).toBeTypeOf('function')
  expect(adapter).toBeTypeOf('function')
})

test('should be ok on good parameters', () => {
  const $store = createStore(0, { name: 'idb-keyval::store-0' })
  expect(() => persist({ store: $store })).not.toThrowError()
})

test('should restore value from IndexedDB, default keyval store', async () => {
  const getValue = getter('keyval-store', 'keyval', 'birthday-of-einstein')
  const setValue = setter('keyval-store', 'keyval', 'birthday-of-einstein')
  await setValue(new Date('1879-03-14T00:00:00.000Z'))
  expect((await getValue()).getTime()).toBe(-2865456000000)

  const $birthday = createStore<Date | null>(null)
  persist({ store: $birthday, key: 'birthday-of-einstein' })

  await tick() // wait for IndexedDB to restore value
  expect($birthday.getState()).toBeInstanceOf(Date)
  expect(($birthday.getState() as Date).getTime()).toBe(-2865456000000)
})

test('should persist value in IndexedDB, default keyval store', async () => {
  const $birthday = createStore<Date | null>(null)
  persist({ store: $birthday, key: 'birthday-of-internet' })

  const getValue = getter('keyval-store', 'keyval', 'birthday-of-internet')
  expect(await getValue()).toBeUndefined()

  // set new value
  ;($birthday as any).setState(new Date('1983-01-01T00:00:00.000Z'))

  await tick() // wait for IndexedDB to persist value
  const value = await getValue()
  expect(value).toBeInstanceOf(Date)
  expect(value.getTime()).toBe(410227200000)
})

test('should restore value from IndexedDB, custom keyval store', async () => {
  const getValue = getter(
    'custom-keyval-db',
    'store',
    'birthday-of-sir-tim-berners-lee'
  )
  const setValue = setter(
    'custom-keyval-db',
    'store',
    'birthday-of-sir-tim-berners-lee'
  )
  await setValue(new Date('1955-06-08T00:00:00.000Z'))
  expect((await getValue()).getTime()).toBe(-459734400000)

  const $birthday = createStore<Date | null>(null)
  persist({
    store: $birthday,
    key: 'birthday-of-sir-tim-berners-lee',
    dbName: 'custom-keyval-db',
    storeName: 'store',
  })

  await tick() // wait for IndexedDB to restore value
  expect($birthday.getState()).toBeInstanceOf(Date)
  expect(($birthday.getState() as Date).getTime()).toBe(-459734400000)
})

test('should persist value in IndexedDB, custom keyval store', async () => {
  const $birthday = createStore<Date | null>(null)
  persist({
    store: $birthday,
    dbName: 'custom-keyval-db',
    storeName: 'store',
    key: 'birthday-of-time',
  })

  const getValue = getter('custom-keyval-db', 'store', 'birthday-of-time')
  expect(await getValue()).toBeUndefined()

  // set new value
  ;($birthday as any).setState(new Date('1970-01-01T00:00:00.000Z'))

  await tick() // wait for IndexedDB to persist value
  const value = await getValue()
  expect(value).toBeInstanceOf(Date)
  expect(value.getTime()).toBe(0)
})

test('should restore value from IndexedDB, custom store object', async () => {
  const store = createIdbKeyvalStore('extra-keyval-db', 'pool')
  await set('my-regexp', /test/, store)
  expect(await get('my-regexp', store)).toEqual(/test/)

  const $re = createStore<RegExp | null>(null)
  persist({
    store: $re,
    key: 'my-regexp',
    keyvalStore: store,
  })

  await tick() // wait for IndexedDB to restore value
  expect($re.getState()).toEqual(/test/)
})

test('should persist value in IndexedDB, custom store object', async () => {
  const store = createIdbKeyvalStore('new-extra-keyval-db', 'pool')

  const $counter = createStore(0)
  persist({
    store: $counter,
    key: 'counter',
    keyvalStore: store,
  })

  expect(await get('counter', store)).toBeUndefined()

  // set new value
  ;($counter as any).setState(1)

  await tick() // wait for IndexedDB to persist value
  expect(await get('counter', store)).toBe(1)
})
