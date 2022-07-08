import { useCallback, useRef } from 'react'
import { DefaultValue } from 'recoil'
import {
  ListenToItems,
  ReadItem,
  RecoilSyncOptions,
  StoreKey,
  WriteItems,
} from 'recoil-sync'

export type GetHistoryKey = () => string | undefined

export type SaveItems = (
  historyKey: string,
  historyItems: Record<string, unknown>
) => void

export type LoadItems = (historyKey: string) => Record<string, unknown>

export type ListenChangeHistory = (handler: () => void) => () => void

export type RecoilHistorySyncOptions = {
  storeKey?: StoreKey
  getHistoryKey: GetHistoryKey
  saveItems: SaveItems
  loadItems: LoadItems
  listenChangeHistory: ListenChangeHistory
}

export function useSyncHistory({
  storeKey,
  getHistoryKey,
  saveItems,
  loadItems,
  listenChangeHistory,
}: RecoilHistorySyncOptions): Omit<RecoilSyncOptions, 'children'> {
  const historyInfo = useRef<{
    historyKey: string
    historyItems: Record<string, unknown>
  }>()

  // set current historyInfo by navigation
  const historyKey = getHistoryKey()
  if (historyKey && historyKey !== historyInfo.current?.historyKey) {
    historyInfo.current = { historyKey, historyItems: {} }
  }

  const read: ReadItem = useCallback((itemKey) => {
    if (!historyInfo.current) {
      return new DefaultValue()
    }

    const { historyItems } = historyInfo.current
    return historyItems[itemKey] ?? new DefaultValue()
  }, [])

  const write: WriteItems = useCallback(
    ({ diff }) => {
      const historyKey = getHistoryKey()
      assertString(historyKey)

      historyInfo.current ??= { historyKey, historyItems: {} }
      const { historyItems } = historyInfo.current
      for (const [itemKey, itemValue] of diff) {
        historyItems[itemKey] = itemValue
      }
    },
    [getHistoryKey]
  )

  const listen: ListenToItems = useCallback(
    ({ updateAllKnownItems }) => {
      return listenChangeHistory(() => {
        // saving previouse history associated items
        if (historyInfo.current) {
          const { historyKey, historyItems } = historyInfo.current
          saveItems(historyKey, historyItems)
        }

        const historyKey = getHistoryKey()
        assertString(historyKey)

        // clear history associated items (by navigation)
        if (historyKey === historyInfo.current?.historyKey) {
          historyInfo.current = undefined
          updateAllKnownItems(new Map())
          return
        }

        // loading history associated items (by forward/back)
        const historyItems = loadItems(historyKey)
        historyInfo.current = { historyKey, historyItems }
        updateAllKnownItems(new Map(Object.entries(historyItems)))
      })
    },
    [getHistoryKey, saveItems, loadItems, listenChangeHistory]
  )

  return { storeKey, read, write, listen }
}

function assertString(s: unknown): asserts s is string {
  if (typeof s !== 'string') {
    throw new Error(`${s} must be string`)
  }
}
