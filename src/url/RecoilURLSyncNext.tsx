import { RecoilURLSync, RecoilURLSyncOptions } from 'recoil-sync'

import { useSyncURLNext } from './useSyncURLNext'

type Props = Omit<RecoilURLSyncOptions, 'browserInterface'>

export type Serialize = (data: unknown) => string

export type Deserialize = (str: string) => unknown

export const RecoilURLSyncNext: React.FC<Props> = ({
  children,
  ...options
}) => {
  const { browserInterface, ...defaultOptions } = useSyncURLNext()

  return (
    <RecoilURLSync
      {...{
        ...defaultOptions,
        ...options,
        browserInterface,
      }}
    >
      {children}
    </RecoilURLSync>
  )
}
