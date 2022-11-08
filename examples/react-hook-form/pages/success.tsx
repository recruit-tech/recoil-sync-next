import type { NextPage } from 'next'
import Head from 'next/head'
import { Links } from '../src/components/Links'
import styles from '../styles/common.module.css'

const SubmitSuccess: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>submit success</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Submit success!!!</h1>
        <Links />
      </main>
    </div>
  )
}

export default SubmitSuccess
