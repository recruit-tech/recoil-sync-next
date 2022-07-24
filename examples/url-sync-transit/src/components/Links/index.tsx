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
        </ul>
      </dd>
      <dt>SSR</dt>
      <dd>
        <ul>
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
      </dd>
      <dt>SSG</dt>
      <dd>
        <ul>
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
      </dd>
    </dl>
  )
}
