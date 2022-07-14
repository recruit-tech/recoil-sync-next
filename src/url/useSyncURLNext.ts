import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'
import { BrowserInterface, RecoilURLSyncOptions } from 'recoil-sync'

export function useSyncURLNext(): Partial<
  Omit<RecoilURLSyncOptions, 'children'>
> {
  const router = useRouter()

  const urlRef = useRef<{
    path: string
    needNotify: boolean
    handler?: () => void
  }>({
    path: router.isReady ? router.asPath : '/',
    needNotify: !router.isReady,
    handler: undefined,
  })

  const { needNotify, handler } = urlRef.current
  useEffect(() => {
    if (needNotify && handler) {
      urlRef.current.path = router.asPath
      urlRef.current.needNotify = false
      handler()
    }
  }, [needNotify, handler, router.asPath])

  const updateURL = useCallback((url: string) => {
    urlRef.current.path = url
  }, [])

  const browserInterface: BrowserInterface = {
    replaceURL: useCallback((url: string) => router.replace(url), [router]),

    pushURL: useCallback((url: string) => router.push(url), [router]),

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
        router.events.on('routeChangeStart', updateURL)
        router.events.on('routeChangeStart', handler)

        return () => {
          router.events.off('routeChangeStart', handler)
          router.events.off('routeChangeStart', updateURL)
          urlRef.current.handler = undefined
        }
      },
      [router, updateURL]
    ),
  }

  return {
    browserInterface,
  }
}
