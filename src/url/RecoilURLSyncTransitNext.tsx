import { RecoilURLSyncTransit, RecoilURLSyncTransitOptions } from 'recoil-sync'

import { useSyncURLNext } from './useSyncURLNext'

type Props = Omit<RecoilURLSyncTransitOptions, 'browserInterface'> & {
  shallow?: boolean
}

export const RecoilURLSyncTransitNext: React.FC<Props> = ({
  children,
  shallow = true,
  ...options
}) => {
  const { browserInterface, ...defaultOptions } = useSyncURLNext({ shallow })

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
