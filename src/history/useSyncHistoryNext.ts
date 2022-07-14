import { useRouter } from 'next/router'
import { useCallback } from 'react'

import {
  GetHistoryKey,
  SaveItems,
  LoadItems,
  ListenChangeHistory,
  RecoilHistorySyncOptions,
} from './useSyncHistory'

export type Serialize = (data: Record<string, unknown>) => string

export type Deserialize = (str: string) => Record<string, unknown>

type RecoilHistorySyncNextOptions = {
  storeKey?: string
  serialize: Serialize
  deserialize: Deserialize
}

function getStorageKey(storeKey: string | undefined, itemsKey: string) {
  return `RecoilSyncHistory::${
    storeKey ?? 'recoil-sync-history-default-store'
  }::${itemsKey}`
}

export function useSyncHistoryNext({
  storeKey,
  serialize,
  deserialize,
}: RecoilHistorySyncNextOptions): RecoilHistorySyncOptions {
  const getHistoryKey: GetHistoryKey = useCallback(() => {
    return globalThis?.history?.state?.key
  }, [])

  const saveItems: SaveItems = useCallback(
    (itemsKey: string, values: Record<string, unknown>) => {
      const storageKey = getStorageKey(storeKey, itemsKey)
      if (Object.keys(values).length === 0) {
        sessionStorage.removeItem(storageKey)
        return
      }
      sessionStorage.setItem(storageKey, serialize(values))
    },
    [storeKey, serialize]
  )

  const loadItems: LoadItems = useCallback(
    (itemsKey: string) => {
      const storageKey = getStorageKey(storeKey, itemsKey)
      const valuesString = sessionStorage.getItem(storageKey)
      if (!valuesString) {
        return {}
      }
      return deserialize(valuesString)
    },
    [storeKey, deserialize]
  )

  const { events } = useRouter()
  const listenChangeHistory: ListenChangeHistory = useCallback(
    (handler) => {
      events.on('routeChangeStart', handler)

      return () => {
        events.off('routeChangeStart', handler)
      }
    },
    [events]
  )

  return {
    storeKey,
    getHistoryKey,
    saveItems,
    loadItems,
    listenChangeHistory,
  }
}
