import { RecoilURLSyncJSON, RecoilURLSyncJSONOptions } from 'recoil-sync'

import { useSyncURLNext } from './useSyncURLNext'

type Props = Omit<RecoilURLSyncJSONOptions, 'browserInterface'> & {
  shallow?: boolean
}

export const RecoilURLSyncJSONNext: React.FC<Props> = ({
  children,
  shallow = true,
  ...options
}) => {
  const { browserInterface, ...defaultOptions } = useSyncURLNext({ shallow })

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
