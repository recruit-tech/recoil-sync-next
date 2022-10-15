import '../styles/globals.css'
import { RecoilEnv, RecoilRoot } from 'recoil'
import { RecoilHistorySyncJSONNext } from 'recoil-sync-next'

import type { AppProps } from 'next/app'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilHistorySyncJSONNext>
        <Component {...pageProps} />
      </RecoilHistorySyncJSONNext>
    </RecoilRoot>
  )
}

export default MyApp
