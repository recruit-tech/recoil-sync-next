import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { RecoilHistorySyncJSONNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilHistorySyncJSONNext storeKey="history-json-store">
        <Component {...pageProps} />
      </RecoilHistorySyncJSONNext>
    </RecoilRoot>
  )
}

export default MyApp
