import '../styles/globals.css'
import { RecoilEnv, RecoilRoot } from 'recoil'
import { RecoilURLSyncTransitNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'
import { ViewState } from '../src/components/ViewStateForm'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncTransitNext
        location={{ part: 'queryParams' }}
        storeKey="url-transit-store"
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
      </RecoilURLSyncTransitNext>
    </RecoilRoot>
  )
}

export default MyApp
