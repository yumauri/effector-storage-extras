# React Native EncryptedStorage adapter

Adapter to persist [_store_] using React Native [EncryptedStorage].

## Preconditions

`@effector-storage/react-native-encrypted-storage` has dependency on `react-native-encrypted-storage`, so it will auto install it.

But depending on your platform and React Native version, you might want to install [EncryptedStorage] manually, because it might require linking.

So, install [EncryptedStorage], following [documentation](https://github.com/emeraldsanto/react-native-encrypted-storage#installation) for your platform.

## Install

Depending on your package manager

```bash
# using `pnpm` ↓
$ pnpm add effector-storage @effector-storage/react-native-encrypted-storage

# using `yarn` ↓
$ yarn add effector-storage @effector-storage/react-native-encrypted-storage

# using `npm` ↓
$ npm install --save effector-storage @effector-storage/react-native-encrypted-storage
```

## Usage

Import `persist` function from `'@effector-storage/react-native-encrypted-storage'` module, and it will just work:

```javascript
import { persist } from '@effector-storage/react-native-encrypted-storage'

// persist store `$counter` with key 'counter'
persist({ store: $counter, key: 'counter' })

// if your storage has a name, you can omit `key` field
persist({ store: $counter })
```

⚠️ Note, that EncryptedStorage is asynchronous.

Two (or more) different stores, persisted with the same key, will be synchronized (_synchronously!_), even if not connected with each other directly — each store will receive updates from another one.

## Formulae

```javascript
import { persist } from '@effector-storage/react-native-encrypted-storage'
```

- `persist({ store, ...options }): Subscription`
- `persist({ source, target, ...options }): Subscription`

### Options

- ... all the [common options](https://github.com/yumauri/effector-storage/tree/main/README.md#options) from `effector-storage`'s `persist` function.
- `serialize`? (_(value: any) => string_): Custom serialize function. Default = `JSON.stringify`.
- `deserialize`? (_(value: string) => any_): Custom deserialize function. Default = `JSON.parse`.

## Adapter

```javascript
import { adapter } from '@effector-storage/react-native-encrypted-storage'
```

- `adapter(options?): StorageAdapter`

### Options

- `serialize`? (_(value: any) => string_): Custom serialize function. Default = `JSON.stringify`.
- `deserialize`? (_(value: string) => any_): Custom deserialize function. Default = `JSON.parse`.

## FAQ

### How do I use custom serialization / deserialization?

Options `serialize` and `deserialize` are got you covered. But make sure, that serialization is stable, meaning, that `deserialize(serialize(object))` is equal to `object` (or `serialize(deserialize(serialize(object))) === serialize(object)`):

```javascript
import { persist } from '@effector-storage/react-native-encrypted-storage'

const $date = createStore(new Date(), { name: 'date' })

persist({
  store: $date,
  serialize: (date) => String(date.getTime()),
  deserialize: (timestamp) => new Date(Number(timestamp)),
})
```

[asyncstorage]: https://react-native-async-storage.github.io/async-storage/
[encryptedstorage]: https://github.com/emeraldsanto/react-native-encrypted-storage
[_subscription_]: https://effector.dev/docs/glossary#subscription
[_store_]: https://effector.dev/docs/api/effector/store
