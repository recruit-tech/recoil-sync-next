import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/common.module.css'

import type { NextPage } from 'next'

const SubmitSuccess: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>submit success</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Submit success!!!</h1>
        <Link href="/form/1">form</Link>
      </main>
    </div>
  )
}

export default SubmitSuccess
