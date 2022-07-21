import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { RecoilURLSyncJSONNext, RecoilURLSyncTransitNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'
import { ViewState } from '../src/components/ViewStateForm'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext
        storeKey="url-json-store"
        location={{ part: 'queryParams' }}
      >
        <RecoilURLSyncTransitNext
          location={{ part: 'queryParams' }}
          storeKey="history-transit-store"
          handlers={[
            {
              tag: 'VS',
              class: ViewState,
              write: x => [x.active, x.pos],
              read: ([active, pos]) => new ViewState(active, pos),
            },
          ]}
        >
          <Component {...pageProps} />
        </RecoilURLSyncTransitNext>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default MyApp
