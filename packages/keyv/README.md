# Keyv adapter

[![bundlejs](https://deno.bundlejs.com/badge?q=@effector-storage/keyv&treeshake=[{persist}]&config={%22esbuild%22:{%22external%22:[%22effector%22,%22keyv%22]}})](https://bundlejs.com/?q=%40effector-storage%2Fkeyv&treeshake=%5B%7Bpersist%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22effector%22%2C%22keyv%22%5D%7D%7D)

Adapter to persist [_store_] in multiple backends, using [Keyv] library.

## Install

Depending on your package manager

```bash
# using `pnpm` ↓
$ pnpm add effector-storage @effector-storage/keyv

# using `yarn` ↓
$ yarn add effector-storage @effector-storage/keyv

# using `npm` ↓
$ npm install --save effector-storage @effector-storage/keyv
```

Also, you need to install required [adapters for Keyv](https://keyv.org/docs/).

## Usage

Due to changes in [Keyv v5](https://keyv.org/docs/v4-to-v5/), you have to create Keyv storage adapter explicitely.

Import `persist` function from `'@effector-storage/keyv'` module, and use it with created adapter:

```javascript
import KeyvRedis from '@keyv/redis'
import { persist } from '@effector-storage/keyv'

// create new Redis Keyv storage adapter
const storage = new KeyvRedis({ uri: 'redis://user:pass@localhost:6379' })

// persist store `$counter` with key 'counter' in Redis
persist({
  store: $counter,
  key: 'counter',
  with: storage,
})
```

⚠️ Note, that [Keyv] is asynchronous.

Two (or more) different stores, persisted with the same key, will be synchronized (_synchronously!_), even if not connected with each other directly — each store will receive updates from another one.

## Formulae

```javascript
import { persist } from '@effector-storage/keyv'
```

- `persist({ store, ...options }): Subscription`
- `persist({ source, target, ...options }): Subscription`

### Options

- ... all the [common options](https://github.com/yumauri/effector-storage/tree/main/README.md#options) from `effector-storage`'s `persist` function.
- `with`?: ([_string_] | [Keyv] | [Keyv.Options]): Connection string for [Keyv] library, or [Keyv] instance, or [Keyv] options. Default = `undefined` (in that case in-memory [Map] is used as a storage)
- `ttl`?: ([_number_]): TTL for stored value in milliseconds. Default = `undefined`

## Adapter

```javascript
import { adapter } from '@effector-storage/keyv'
```

- `adapter(options?): StorageAdapter`

### Options

- `with`?: ([Keyv] | [KeyvStoreAdapter] | [KeyvOptions] | [Map]): Keyv instance, or Keyv storage adapter, or Keyv options. Default = `undefined` (in that case Keyv uses in-memory [Map] as a storage)
- `ttl`?: ([_number_]): TTL for stored value in milliseconds. Default = `undefined`

## FAQ

### How do I use custom serialization / deserialization?

Adapter doesn't provide extra serialization options, but you can use [Keyv] options to achieve that:

```javascript
persist({
  store: $counter,
  key: 'counter',
  with: {
    store: new KeyvRedis({ uri: 'redis://user:pass@localhost:6379' }),
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
})
```

or use separate Keyv instance:

```javascript
const keyv = new Keyv(
  new KeyvRedis({ uri: 'redis://user:pass@localhost:6379' }),
  {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  }
)

persist({
  store: $counter,
  key: 'counter',
  with: keyv,
})
```

Please, read [Keyv] documentation for more details.

[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[keyv]: https://github.com/jaredwray/keyv
[keyvstoreadapter]: https://github.com/jaredwray/keyv/tree/main/packages/keyv#api
[keyvoptions]: https://github.com/jaredwray/keyv/tree/main/packages/keyv#api
[_subscription_]: https://effector.dev/docs/glossary#subscription
[_store_]: https://effector.dev/docs/api/effector/store
[_number_]: https://developer.mozilla.org/en-US/docs/Glossary/Number
[_string_]: https://developer.mozilla.org/en-US/docs/Glossary/String
