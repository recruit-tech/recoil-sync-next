import Head from 'next/head'

import { Counter } from '../../src/components/Counter'
import { Textfield } from '../../src/components/Textfield'
import { Links } from '../../src/components/Links'
import styles from '../../styles/Home.module.css'

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

type Props = {
  id: string
}

const SSGPage: NextPage<Props> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SSG - Example of RecoilURLSyncJSONNext</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SSG Page {id}</h1>
        <Textfield />
        <Counter name="foo" initialValue={0} />
        <Counter name="bar" initialValue={10} />
        <Counter name="baz" initialValue={100} />
        <Links />
      </main>
    </div>
  )
}

export default SSGPage

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, { id: string }> = async ({
  params,
}) => {
  if (params?.id === undefined) throw new Error('`params.id` is undefined.')

  return {
    props: {
      id: params?.id,
    },
  }
}
