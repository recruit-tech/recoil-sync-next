import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import styles from '../../styles/form.module.css'

import type { NextPage } from 'next'

type FormData = {
  name: string
  comment: string
}

const Form: NextPage = () => {
  const router = useRouter()
  const { handleSubmit, register } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = async data => {
    console.log('submit data', data)
    await router.push('/form/success')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Form</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Form</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <dl className={styles.formList}>
            <dt>name</dt>
            <dd>
              <input type="text" {...register('name')} />
            </dd>
            <dt>comment</dt>
            <dd>
              <input type="text" {...register('comment')} />
            </dd>
          </dl>
          <button>submit</button>
        </form>
      </main>
    </div>
  )
}

export default Form
