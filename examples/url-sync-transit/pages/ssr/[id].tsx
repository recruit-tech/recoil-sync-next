import Head from 'next/head'

import { Links } from '../../src/components/Links'
import { ViewStateForm } from '../../src/components/ViewStateForm'
import styles from '../../styles/Home.module.css'

import type { GetServerSideProps, NextPage } from 'next'

type Props = {
  id: string
}

const SSRPage: NextPage<Props> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SSR - Example of RecoilHistorySyncJSONNext</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SSR Page {id}</h1>
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

export default SSRPage

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
