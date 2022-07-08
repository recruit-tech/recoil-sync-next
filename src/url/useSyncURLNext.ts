import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'
import { BrowserInterface, RecoilURLSyncOptions } from 'recoil-sync'

export function useSyncURLNext(): Partial<
  Omit<RecoilURLSyncOptions, 'children'>
> {
  const router = useRouter()
  const urlRef = useRef(router.asPath)

  const updateURL = useCallback((url: string) => {
    urlRef.current = url
  }, [])

  const browserInterface: BrowserInterface = {
    replaceURL: useCallback((url: string) => router.replace(url), [router]),

    pushURL: useCallback((url: string) => router.push(url), [router]),

    getURL: useCallback(() => {
      const url = new URL(
        urlRef.current,
        globalThis?.document?.location?.href ?? 'http://localhost:3000'
      )
      return url.toString()
    }, []),

    listenChangeURL: useCallback(
      (handler: () => void) => {
        router.events.on('routeChangeStart', updateURL)
        router.events.on('routeChangeStart', handler)

        return () => {
          router.events.off('routeChangeStart', handler)
          router.events.off('routeChangeStart', updateURL)
        }
      },
      [router, updateURL]
    ),
  }

  return {
    browserInterface,
  }
}
