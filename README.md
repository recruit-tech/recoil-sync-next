# recoil-sync-next

recoil-sync stores for Next.js

## Installation

```shell
npm install recoil recoil-sync recoil-sync-next
# or
yarn add recoil recoil-sync recoil-sync-next
# or
pnpm add recoil recoil-sync recoil-sync-next
```

## API

### URL Persistence

This provides recoil-sync's [URL Persistence](https://recoiljs.org/docs/recoil-sync/url-persistence)
functionality synced with [next/router](https://nextjs.org/docs/api-reference/next/router).

#### \<RecoilURLSyncJSONNext>

A version of [\<RecoilURLSyncJSON>](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncJSON) that works with next/router
to sync atoms with the browser URL using JSON encoding.
This should be a child element of [\<RecoilRoot>](https://recoiljs.org/docs/api-reference/core/RecoilRoot).

```typescript
function RecoilURLSyncJSONNext({
  storeKey?: string | undefined,
  location: LocationOption,
  children: ReactNode
}): ReactNode
```

##### Props

- `storeKey`
  - This prop is used to match up which atoms should sync with this external store.
    See [Syncing with Multiple Storages](https://recoiljs.org/docs/recoil-sync/sync-effect#syncing-with-multiple-storages) for more info.
- `location`
  - Tis prop specifies what part of the URL to sync.
    See [URL Location](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSync#url-location) for more info.
- `children`
  - React elements in your component tree.

##### Example

```typescript
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <Component {...pageProps} />
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}
```

#### \<RecoilURLSyncTransitNext>

A version of [\<RecoilURLSyncTransit>](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncTransit) that works with next/router
to sync atoms with the browser URL using [Transit encoding](https://github.com/cognitect/transit-js).
This should be a child element of [\<RecoilRoot>](https://recoiljs.org/docs/api-reference/core/RecoilRoot).

```typescript
function RecoilURLSyncJSONNext({
  storeKey?: string | undefined,
  location: LocationOption,
  handlers: ReadonlyArray<TransitHandler<any, any>>
  children: ReactNode
}): ReactNode
```

##### Props

- `storeKey`
  - This prop is used to match up which atoms should sync with this external store.
    See [Syncing with Multiple Storages](https://recoiljs.org/docs/recoil-sync/sync-effect#syncing-with-multiple-storages) for more info.
- `location`
  - Tis prop specifies what part of the URL to sync.
    See [URL Location](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSync#url-location) for more info.
- `handlers`
  - The array of user defined custom encoder/decoder object.
    See [Custom Classes](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncTransit#custom-classes) for more info.
- `children`
  - React elements in your component tree.

##### Example

```typescript
import { RecoilURLSyncTransitNext } from 'recoil-sync-next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncTransitNext location={{ part: 'queryParams' }}>
        <Component {...pageProps} />
      </RecoilURLSyncTransitNext>
    </RecoilRoot>
  )
}
```

### Session Storage Persistence synced with History

Provides persistence of atoms to session storage synced with the position of the history entry.
It will save atoms to session storage when the history entry's position is moved.
When the user moves backward/forward on history entries (i.e. `'popstate'` event is fired),
the atoms saved with that position is restored.

#### \<RecoilHistorySyncJSONNext>

To sync atoms with the position of the history entry using JSON encoding.
This should be a child element of [\<RecoilRoot>](https://recoiljs.org/docs/api-reference/core/RecoilRoot).

```typescript
function RecoilHistorySyncJSONNext({
  storeKey?: string | undefined,
  children: ReactNode
}): ReactNode
```

##### Props

- `storeKey`
  - This prop is used to match up which atoms should sync with this external store.
    See [Syncing with Multiple Storages](https://recoiljs.org/docs/recoil-sync/sync-effect#syncing-with-multiple-storages) for more info.
- `children`
  - React elements in your component tree.

##### Example

```typescript
import { RecoilHistorySyncJSONNext } from 'recoil-sync-next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilHistorySyncJSONNext>
        <Component {...pageProps} />
      </RecoilHistorySyncJSONNext>
    </RecoilRoot>
  )
}
```

#### \<RecoilHistorySyncTransitNext>

To sync atoms with the position of the history entry using [Transit encoding](https://github.com/cognitect/transit-js).
This should be a child element of [\<RecoilRoot>](https://recoiljs.org/docs/api-reference/core/RecoilRoot).

```typescript
function RecoilHistorySyncTransitNext({
  storeKey?: string | undefined,
  handlers: ReadonlyArray<TransitHandler<any, any>>
  children: ReactNode
}): ReactNode
```

##### Props

- `storeKey`
  - This prop is used to match up which atoms should sync with this external store.
    See [Syncing with Multiple Storages](https://recoiljs.org/docs/recoil-sync/sync-effect#syncing-with-multiple-storages) for more info.
- `handlers`
  - The array of user defined custom encoder/decoder object.
    See [Custom Classes](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncTransit#custom-classes) for more info.
- `children`
  - React elements in your component tree.

##### Example

```typescript
import { RecoilHistorySyncTransitNext } from 'recoil-sync-next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilHistorySyncTransitNext>
        <Component {...pageProps} />
      </RecoilHistorySyncTransitNext>
    </RecoilRoot>
  )
}
```

### Utilities

#### atomFamilyWithInitialValue

`atomFamily`, but initial value can be specified individually.

```typescript
function atomFamilyWithInitialValue<
  T extends SerializableParam,
  P extends SerializableParam
>({
  key: NodeKey,
  effects?: | ReadonlyArray<AtomEffect<T>> | ((param: P) => ReadonlyArray<AtomEffect<T>>),
  dangerouslyAllowMutability?: boolean,
}): (parameter: P, initialValue: T) => RecoilState<T>
```

##### Type Parameters

- T
  - The type of the atom value.
    It must be compared using value-equality and must be serializable.
- P
  - The type of the paramter that map to each atom.
    It must be compared using value-equality and must be serializable.

##### Parameters

See [atomFamily](https://recoiljs.org/docs/api-reference/utils/atomFamily) for more info.

##### Return

A function which takes `paramter` that map to an atom, and its `initialValue`.

##### Example

```typescript
import { atomFamilyWithInitialValue } from 'recoil-sync-next'

const countState = atomFamilyWithInitialValue<number, string>({
  key: 'count',
})

const MyComponent = (React.FC = () => {
  const [count1, setCount1] = useRecoilState(countState('foo', 0)) // count1 is initialized to 0
  const [count2, setCount2] = useRecoilState(countState('bar', 100)) // count2 is initialized to 100
})
```
