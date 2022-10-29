import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import { syncEffect } from 'recoil-sync'
import { array, object, string } from '@recoiljs/refine'
import { initializableAtom } from 'recoil-sync-next'
import { useFormSync } from '../../src/hooks/useFormSync'
import styles from '../../styles/form.module.css'

type FormState = {
  name: string
  comment: string
  items: readonly {
    value: string
  }[]
}

const formState = initializableAtom<FormState>({
  key: 'formState',
  effects: [
    syncEffect({
      refine: object({
        name: string(),
        comment: string(),
        items: array(
          object({
            value: string(),
          })
        ),
      }),
    }),
  ],
})

const initialState = {
  name: 'a',
  comment: 'b',
  items: [{ value: '1' }, { value: '2' }],
}

const emptyItem: FormState['items'][number] = {
  value: '',
}

const Form: NextPage<FormState> = (props) => {
  // check render
  console.log('Form: re render')

  const {
    control,
    registerWithDefaultValue,
    onChangeForm,
    handleSubmit,
    reset,
    useFieldArraySync,
  } = useFormSync<FormState>(formState(props))
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArraySync({
      control,
      name: 'items',
    })

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
              <input type="text" {...registerWithDefaultValue('name')} />
            </dd>
            <dt>comment</dt>
            <dd>
              <input type="text" {...registerWithDefaultValue('comment')} />
            </dd>
            <dt>items</dt>
            <dd>
              <button type="button" onClick={() => prepend(emptyItem)}>
                Prepend
              </button>
              <ul>
                {fields.map((field, index) => (
                  <li key={field.id}>
                    <span>{index} </span>
                    <input
                      {...registerWithDefaultValue(
                        `items.${index}.value` as const
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => insert(index, emptyItem)}
                    >
                      Insert before
                    </button>
                    <button
                      type="button"
                      onClick={() => insert(index + 1, emptyItem)}
                    >
                      Insert after
                    </button>
                    <button
                      type="button"
                      disabled={index >= fields.length - 1}
                      onClick={() => swap(index, index + 1)}
                    >
                      Swap to next
                    </button>
                    <button type="button" onClick={() => move(index, 0)}>
                      Move to first
                    </button>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => append(emptyItem)}>
                Append
              </button>
            </dd>
          </dl>
          <button>Submit</button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </form>
      </main>
    </div>
  )
}

export default Form

export const getServerSideProps: GetServerSideProps<FormState> = async ({
  params,
}) => {
  return {
    props: initialState,
  }
}
