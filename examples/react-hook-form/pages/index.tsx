import type { NextPage } from 'next'
import Head from 'next/head'
import { Links } from '../src/components/Links'
import styles from '../styles/common.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Top - Example of RecoilHistorySyncJSONNext</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Top page</h1>
        <Links />
      </main>
    </div>
  )
}

export default Home
