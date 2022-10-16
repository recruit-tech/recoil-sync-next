import '../styles/globals.css'
import { RecoilEnv, RecoilRoot } from 'recoil'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext
        storeKey="url-json-store"
        location={{ part: 'queryParams' }}
      >
        <Component {...pageProps} />
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default MyApp
