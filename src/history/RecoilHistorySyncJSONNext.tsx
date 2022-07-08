import React from 'react'
import { RecoilSync, StoreKey } from 'recoil-sync'

import { useSyncHistory } from './useSyncHistory'
import { useSyncHistoryNext } from './useSyncHistoryNext'

type Props = {
  storeKey?: StoreKey
  children: React.ReactNode
}

export const RecoilHistorySyncJSONNext: React.FC<Props> = ({
  storeKey,
  children,
}) => {
  const opts = useSyncHistory(
    useSyncHistoryNext({
      storeKey,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    })
  )
  return <RecoilSync {...opts}>{children}</RecoilSync>
}
