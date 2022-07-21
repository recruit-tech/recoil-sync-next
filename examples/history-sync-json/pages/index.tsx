import Head from 'next/head'

import { Counter } from '../src/components/Counter'
import { Links } from '../src/components/Links'
import { Textfield } from '../src/components/Textfield'
import { ViewStateForm } from '../src/components/ViewStateForm'
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
        <div>
          <h2>Textfield</h2>
          <Textfield />
        </div>
        <div>
          <h2>Counter</h2>
          <Counter name="foo" initialValue={0} />
          <Counter name="bar" initialValue={10} />
          <Counter name="baz" initialValue={100} />
        </div>
        <div>
          <h2>ViewState</h2>
          <ViewStateForm />
        </div>
        <div>
          <h2>Links</h2>
          <Links />
        </div>
      </main>
    </div>
  )
}

export default Home
