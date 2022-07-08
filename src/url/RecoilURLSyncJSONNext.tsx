import { RecoilURLSyncJSON, RecoilURLSyncJSONOptions } from 'recoil-sync'

import { useSyncURLNext } from './useSyncURLNext'

type Props = Omit<RecoilURLSyncJSONOptions, 'browserInterface'>

export const RecoilURLSyncJSONNext: React.FC<Props> = ({
  children,
  ...options
}) => {
  const { browserInterface, ...defaultOptions } = useSyncURLNext()

  return (
    <RecoilURLSyncJSON
      {...{
        ...defaultOptions,
        ...options,
        browserInterface,
      }}
    >
      {children}
    </RecoilURLSyncJSON>
  )
}
