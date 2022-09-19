import { bool } from '@recoiljs/refine'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'
import { initializableAtomFamily } from 'recoil-sync-next'

export const openState = initializableAtomFamily<boolean, string>({
  key: 'openState',
  effects: [syncEffect({ refine: bool() })],
})

export const Links: React.FC = () => {
  const [top, setTop] = useRecoilState(openState('top', true))
  const [ssr, setSsr] = useRecoilState(openState('ssr', false))
  const [ssg, setSsg] = useRecoilState(openState('ssg', false))

  return (
    <div>
      <details
        open={top}
        onClick={(event) => {
          event.preventDefault()
          setTop((value) => !value)
        }}
      >
        <summary>Top</summary>
        <ul onClick={(event) => event.stopPropagation()}>
          <li>
            <Link href="/">Top</Link>
          </li>
        </ul>
      </details>
      <details
        open={ssr}
        onClick={(event) => {
          event.preventDefault()
          setSsr((value) => !value)
        }}
      >
        <summary>SSR</summary>
        <ul onClick={(event) => event.stopPropagation()}>
          <li>
            <Link href="/ssr/1">SSR 1</Link>
          </li>
          <li>
            <Link href="/ssr/2">SSR 2</Link>
          </li>
          <li>
            <Link href="/ssr/3">SSR 3</Link>
          </li>
        </ul>
      </details>
      <details
        open={ssg}
        onClick={(event) => {
          event.preventDefault()
          setSsg((value) => !value)
        }}
      >
        <summary>SSG</summary>
        <ul onClick={(event) => event.stopPropagation()}>
          <li>
            <Link href="/ssg/1">SSG 1</Link>
          </li>
          <li>
            <Link href="/ssg/2">SSG 2</Link>
          </li>
          <li>
            <Link href="/ssg/3">SSG 3</Link>
          </li>
        </ul>
      </details>
    </div>
  )
}
