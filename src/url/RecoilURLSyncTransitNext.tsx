import { RecoilURLSyncTransit, RecoilURLSyncTransitOptions } from 'recoil-sync'

import { useSyncURLNext } from './useSyncURLNext'

type Props = Omit<RecoilURLSyncTransitOptions, 'browserInterface'>

export const RecoilURLSyncTransitNext: React.FC<Props> = ({
  children,
  ...options
}) => {
  const { browserInterface, ...defaultOptions } = useSyncURLNext()

  return (
    <RecoilURLSyncTransit
      {...{
        ...defaultOptions,
        ...options,
        browserInterface,
      }}
    >
      {children}
    </RecoilURLSyncTransit>
  )
}
