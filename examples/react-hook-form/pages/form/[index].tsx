import { string } from '@recoiljs/refine'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import { atom, useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'
import styles from '../../styles/form.module.css'

import type { NextPage } from 'next'

const nameState = atom({
  key: 'nameState',
  default: '',
  effects: [syncEffect({ refine: string() })],
})

const commentState = atom({
  key: 'commentState',
  default: '',
  effects: [syncEffect({ refine: string() })],
})

type FormData = {
  name: string
  comment: string
}

const Form: NextPage = () => {
  // Every time recoil state is updated, rendering is called,
  // but no DOM update is made if it is kept to un-controlling components.
  const [name, setName] = useRecoilState(nameState)
  const [comment, setComment] = useRecoilState(commentState)

  // form
  const router = useRouter()
  const { handleSubmit, register } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      name,
      comment,
    },
  })
  const onSubmit: SubmitHandler<FormData> = async (data) => {
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
              <input
                type="text"
                {...register('name')}
                onChange={(e) => setName(e.target.value)}
              />
            </dd>
            <dt>comment</dt>
            <dd>
              <input
                type="text"
                {...register('comment')}
                onChange={(e) => setComment(e.target.value)}
              />
            </dd>
          </dl>
          <button>submit</button>
        </form>
      </main>
    </div>
  )
}

export default Form
