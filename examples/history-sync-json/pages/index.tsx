import Head from 'next/head'

import { Counter } from '../src/components/Counter'
import { Links } from '../src/components/Links'
import { Textfield } from '../src/components/Textfield'
import styles from '../styles/Home.module.css'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Top - Example of RecoilHistorySyncJSONNext</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Top page (Static)</h1>
        <Textfield />
        <Counter name="foo" initialValue={0} />
        <Counter name="bar" initialValue={10} />
        <Counter name="baz" initialValue={100} />
        <Links />
      </main>
    </div>
  )
}

export default Home
