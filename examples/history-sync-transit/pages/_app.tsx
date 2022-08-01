import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { RecoilHistorySyncTransitNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'
import { ViewState } from '../src/components/ViewStateForm'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilHistorySyncTransitNext
        storeKey="history-transit-store"
        handlers={[
          {
            tag: 'VS',
            class: ViewState,
            write: (x) => [x.active, x.pos],
            read: ([active, pos]) => new ViewState(active, pos),
          },
        ]}
      >
        <Component {...pageProps} />
      </RecoilHistorySyncTransitNext>
    </RecoilRoot>
  )
}

export default MyApp
