import Head from 'next/head'
import Link from 'next/link'

import { Counter } from '../../src/components/Counter'
import { Textfield } from '../../src/components/Textfield'
import styles from '../../styles/Home.module.css'

import type { GetServerSideProps, NextPage } from 'next'

type Props = {
  id: string
}

const Home: NextPage<Props> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Article {id}</h1>
        <Textfield />
        <Counter name="foo" initialValue={0} />
        <Counter name="bar" initialValue={10} />
        <Counter name="baz" initialValue={100} />
        <ul>
          <li>
            <Link href="/articles/1">article 1</Link>
          </li>
          <li>
            <Link href="/articles/2">article 2</Link>
          </li>
          <li>
            <Link href="/articles/3">article 3</Link>
          </li>
        </ul>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  if (params?.id === undefined) throw new Error('`params.id` is undefined.')

  return {
    props: {
      id: params?.id,
    },
  }
}
