import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'

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
