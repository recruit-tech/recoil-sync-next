import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'
import { BrowserInterface, RecoilURLSyncOptions } from 'recoil-sync'

export function useSyncURLNext(): Partial<
  Omit<RecoilURLSyncOptions, 'children'>
> {
  const { isReady, asPath, replace, push, events } = useRouter()

  const urlRef = useRef<{
    path: string
    needNotify: boolean
    handler?: () => void
  }>({
    path: isReady ? asPath : '/',
    needNotify: !isReady,
    handler: undefined,
  })

  const { needNotify, handler } = urlRef.current
  useEffect(() => {
    if (isReady && needNotify && handler) {
      urlRef.current.path = asPath
      urlRef.current.needNotify = false
      handler()
    }
  }, [isReady, needNotify, handler, asPath])

  const updateURL = useCallback((url: string) => {
    urlRef.current.path = url
  }, [])

  const browserInterface: BrowserInterface = {
    replaceURL: useCallback((url: string) => replace(url), [replace]),

    pushURL: useCallback((url: string) => push(url), [push]),

    getURL: useCallback(() => {
      const url = new URL(
        urlRef.current.path,
        globalThis?.document?.location?.href ?? 'http://localhost:3000'
      )
      return url.toString()
    }, []),

    listenChangeURL: useCallback(
      (handler: () => void) => {
        urlRef.current.handler = handler
        events.on('routeChangeStart', updateURL)
        events.on('routeChangeStart', handler)

        return () => {
          events.off('routeChangeStart', handler)
          events.off('routeChangeStart', updateURL)
          urlRef.current.handler = undefined
        }
      },
      [events, updateURL]
    ),
  }

  return {
    browserInterface,
  }
}
