import Head from 'next/head'
import Link from 'next/link'

import { Counter } from '../src/components/Counter/counter'
import styles from '../styles/Home.module.css'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Example of RecoilURLSyncJSONNext</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Top page</h1>
        <Counter />
        <ul>
          <li>
            <Link href="/articles/1">
              <a>article 1</a>
            </Link>
          </li>
          <li>
            <Link href="/articles/2">
              <a>article 2</a>
            </Link>
          </li>
          <li>
            <Link href="/articles/3">
              <a>article 3</a>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}

export default Home
