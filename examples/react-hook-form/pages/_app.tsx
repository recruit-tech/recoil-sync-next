import '../styles/globals.css'
import { RecoilEnv, RecoilRoot } from 'recoil'
import {
  RecoilHistorySyncJSONNext,
  RecoilURLSyncJSONNext,
} from 'recoil-sync-next'

import type { AppProps } from 'next/app'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

function MyApp({ Component, pageProps }: AppProps) {
  console.log(`MyApp: (re) render`)

  return (
    <RecoilRoot>
      <RecoilHistorySyncJSONNext storeKey="history-store">
        <RecoilURLSyncJSONNext
          storeKey="url-store"
          location={{ part: 'queryParams' }}
        >
          <Component {...pageProps} />
        </RecoilURLSyncJSONNext>
      </RecoilHistorySyncJSONNext>
    </RecoilRoot>
  )
}

export default MyApp
