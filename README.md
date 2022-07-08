# recoil-sync-next

recoil-sync stores for Next.js

## Installation

```shell
yarn add recoil-sync-next
```

## API

### URL Persistence

This provides recoil-sync's [URL Persistence](https://recoiljs.org/docs/recoil-sync/url-persistence)
functionality synced with [next/router](https://nextjs.org/docs/api-reference/next/router).

#### \<RecoilURLSyncJSONNext>

See [RecoilURLSyncJSON](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncJSON) for more Info.

##### Example:

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

See [RecoilURLSyncTransit](https://recoiljs.org/docs/recoil-sync/api/RecoilURLSyncTransit) for more Info.

##### Example:

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

### SessionStorage Persistence synced with History

#### \<RecoilHistorySyncJSONNext>

##### Example:

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

##### Example:

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

`atomFamilyWithInitialValue` is an `atomFamily`, but it can be specified initial value individually.

##### Example:

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
