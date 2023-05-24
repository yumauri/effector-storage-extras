# IndexedDB adapter

Adapter to persist [_store_] in [IndexedDB], using [idb-keyval] library.

## Install

Depending on your package manager

```bash
# using `pnpm` ↓
$ pnpm add effector-storage @effector-storage/idb-keyval

# using `yarn` ↓
$ yarn add effector-storage @effector-storage/idb-keyval

# using `npm` ↓
$ npm install --save effector-storage @effector-storage/idb-keyval
```

## Usage

Import `persist` function from `'@effector-storage/idb-keyval'` module, and it will just work:

```javascript
import { persist } from '@effector-storage/idb-keyval'

// persist store `$counter` with key 'counter'
persist({ store: $counter, key: 'counter' })

// if your storage has a name, you can omit `key` field
persist({ store: $counter })
```

⚠️ Note, that IndexedDB is asynchronous.

Two (or more) different stores, persisted with the same key, will be synchronized (_synchronously!_), even if not connected with each other directly — each store will receive updates from another one.

## Formulae

```javascript
import { persist } from '@effector-storage/idb-keyval'
```

- `persist({ store, ...options }): Subscription`
- `persist({ source, target, ...options }): Subscription`

### Options

- ... all the [common options](https://github.com/yumauri/effector-storage/tree/main/README.md#options) from `effector-storage`'s `persist` function.
- `timeout`?: ([_number_]): Timeout in milliseconds, which will be used to throttle and batch updates. Default = `undefined` (meaning updates will be saved immediately)
- `dbName`?: ([_string_]): IndexedDB database name. Default = `undefined` (in that case default `idb-keyval` database will be used — `'keyval-store'`)
- `storeName`?: ([_string_]): IndexedDB store name. Default = `undefined` (in that case default `idb-keyval` store will be used — `'keyval'`)
- `keyvalStore`?: (_UseStore_): Custom `idb-keyval` store. Default = `undefined` (in that case default `idb-keyval` store will be used)

## Adapter

```javascript
import { adapter } from '@effector-storage/idb-keyval'
```

- `adapter(options?): StorageAdapter`

### Options

- `timeout`?: ([_number_]): Timeout in milliseconds, which will be used to throttle and batch updates. Default = `undefined` (meaning updates will be saved immediately)
- `dbName`?: ([_string_]): IndexedDB database name. Default = `undefined` (in that case default `idb-keyval` database will be used — `'keyval-store'`)
- `storeName`?: ([_string_]): IndexedDB store name. Default = `undefined` (in that case default `idb-keyval` store will be used — `'keyval'`)
- `keyvalStore`?: (_UseStore_): Custom `idb-keyval` store. Default = `undefined` (in that case default `idb-keyval` store will be used)

## Gotchas

Although you can specify custom name for IndexedDB database, and custom name for IndexedDB store, I wouldn't recommend that. Please, read [this document](https://github.com/jakearchibald/idb-keyval/blob/main/custom-stores.md) from `idb-keyval` library.

## FAQ

### How do I use custom serialization / deserialization?

You don't need to! IndexedDB can store any structured-clonable data.

[IndexedDB]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[idb-keyval]: https://github.com/jakearchibald/idb-keyval
[_subscription_]: https://effector.dev/docs/glossary#subscription
[_store_]: https://effector.dev/docs/api/effector/store
[_number_]: https://developer.mozilla.org/en-US/docs/Glossary/Number
[_string_]: https://developer.mozilla.org/en-US/docs/Glossary/String
