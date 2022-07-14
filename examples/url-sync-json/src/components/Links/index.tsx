import Link from 'next/link'

export const Links: React.FC = () => {
  return (
    <dl>
      <dt>Top</dt>
      <dd>
        <ul>
          <li>
            <Link href="/">Top</Link>
          </li>
          <li>
            <Link href={'/?textState="Recoil"'}>Top</Link>
            <span>&nbsp;(with text: &quot;Recoil&quot;)</span>
          </li>
        </ul>
      </dd>
      <dt>SSR</dt>
      <dd>
        <ul>
          <li>
            <Link href="/ssr/1">SSR 1</Link>
          </li>
          <li>
            <Link href={'/ssr/2?textState="Sync"'}>SSR 2</Link>
            <span>&nbsp;(with text: &quot;Sync&quot;)</span>
          </li>
          <li>
            <Link href={'/ssr/3?counterState__"foo"=1&counterState__"bar"=11'}>
              SSR 3
            </Link>
            <span>&nbsp;(with foo: 1, bar: 11)</span>
          </li>
        </ul>
      </dd>
      <dt>SSG</dt>
      <dd>
        <ul>
          <li>
            <Link href="/ssg/1">SSG 1</Link>
          </li>
          <li>
            <Link href={'/ssg/2?textState="Sync"'}>SSG 2</Link>
            <span>&nbsp;(with text: &quot;Sync&quot;)</span>
          </li>
          <li>
            <Link href={'/ssg/3?counterState__"foo"=1&counterState__"bar"=11'}>
              SSG 3
            </Link>
            <span>&nbsp;(with foo: 1, bar: 11)</span>
          </li>
        </ul>
      </dd>
    </dl>
  )
}
