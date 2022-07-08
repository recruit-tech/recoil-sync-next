/*
 * A part of these functions are:
 *   Copyright (c) Facebook, Inc. and its affiliates.
 *   Released under the MIT license.
 *   https://github.com/facebookexperimental/Recoil/blob/main/LICENSE
 */
import React, { useCallback, useMemo } from 'react'
import { DefaultValue } from 'recoil'
import { RecoilSync, StoreKey, TransitHandler } from 'recoil-sync'
import transit from 'transit-js'

import { useSyncHistory } from './useSyncHistory'
import { useSyncHistoryNext } from './useSyncHistoryNext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransitHandlerArray = readonly TransitHandler<any, any>[]

const BUILTIN_HANDLERS: TransitHandlerArray = [
  {
    tag: 'Date',
    class: Date,
    write: (x: Date) => x.toISOString(),
    read: (str: string) => new Date(str),
  },
  {
    tag: 'Set',
    class: Set,
    write: (x: Set<unknown>) => Array.from(x),
    read: (arr: unknown[]) => new Set(arr),
  },
  {
    tag: 'Map',
    class: Map,
    write: (x: Map<unknown, unknown>) => Array.from(x.entries()),
    read: (arr: [unknown, unknown][]) => new Map(arr),
  },
  {
    tag: '__DV',
    class: DefaultValue,
    write: () => 0, // number encodes the smallest in URL
    read: () => new DefaultValue(),
  },
]

type Props = {
  storeKey?: StoreKey
  handlers?: TransitHandlerArray
  children: React.ReactNode
}

export const RecoilHistorySyncTransitNext: React.FC<Props> = ({
  storeKey,
  handlers: optionalHandlers,
  children,
}) => {
  const handlers = useMemo(
    () => [...BUILTIN_HANDLERS, ...(optionalHandlers ?? [])],
    [optionalHandlers]
  )

  const writer = useMemo(
    () =>
      transit.writer('json', {
        handlers: transit.map(
          handlers
            .map((handler) => [
              handler.class,
              transit.makeWriteHandler({
                tag: () => handler.tag,
                rep: handler.write,
                stringRep: () => null,
              }),
            ])
            .flat(1)
        ),
      }),
    [handlers]
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = useCallback((x: any) => writer.write(x), [writer])

  const reader = useMemo(
    () =>
      transit.reader('json', {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlers: handlers.reduce<Record<string, (val: any) => any>>(
          (c, { tag, read }) => {
            c[tag] = read
            return c
          },
          {}
        ),
        mapBuilder: {
          init: () => ({}),
          add: (ret, key, val) => {
            ret[key] = val
            return ret
          },
          finalize: (ret) => ret,
        },
      }),
    [handlers]
  )
  const deserialize = useCallback((x: string) => reader.read(x), [reader])

  const opts = useSyncHistory(
    useSyncHistoryNext({
      storeKey,
      serialize,
      deserialize,
    })
  )
  return <RecoilSync {...opts}>{children}</RecoilSync>
}
