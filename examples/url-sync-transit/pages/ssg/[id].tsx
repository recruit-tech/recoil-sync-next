import Head from 'next/head'

import { Links } from '../../src/components/Links'
import { ViewStateForm } from '../../src/components/ViewStateForm'
import styles from '../../styles/Home.module.css'

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

type Props = {
  id: string
}

const SSGPage: NextPage<Props> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SSG - Example of RecoilURLSyncTransitNext</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SSG Page {id}</h1>
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
