import { object, string } from '@recoiljs/refine'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import { syncEffect } from 'recoil-sync'
import { initializableAtom } from 'recoil-sync-next'
import { useFormSync } from '../../src/hooks/useFormSync'
import styles from '../../styles/form.module.css'

import type { NextPage } from 'next'

type FormState = {
  name: string
  comment: string
}

const formState = initializableAtom<FormState>({
  key: 'formState',
  effects: [
    syncEffect({
      refine: object({
        name: string(),
        comment: string(),
      }),
    }),
  ],
})

const Form: NextPage = () => {
  // check render
  console.log('Form: re render')

  const { register, onChangeForm, handleSubmit } = useFormSync(
    formState({ name: 'a', comment: 'b' })
  )
  const router = useRouter()
  const onSubmit: SubmitHandler<FormState> = async (data) => {
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

        <form onSubmit={handleSubmit(onSubmit)} onChange={onChangeForm}>
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
