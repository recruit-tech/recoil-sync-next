import Link from 'next/link'

export const Links: React.FC = () => {
  return (
    <>
      <h2>History synced form</h2>
      <div>
        <Link href="/history-form/1">Form[1]</Link>
        &nbsp;
        <Link href="/history-form/2">Form[2]</Link>
        &nbsp;
        <Link href="/history-form/3">Form[3]</Link>
      </div>
      <h2>URL synced form</h2>
      <div>
        <Link href="/url-form/1">Form[1]</Link>
        &nbsp;
        <Link href="/url-form/2">Form[2]</Link>
        &nbsp;
        <Link href="/url-form/3">Form[3]</Link>
      </div>
      <h2>useFormSyncContext</h2>
      <div>
        <Link href="/form-context/1">Form[1]</Link>
        &nbsp;
        <Link href="/form-context/2">Form[2]</Link>
        &nbsp;
        <Link href="/form-context/3">Form[3]</Link>
      </div>
    </>
  )
}
