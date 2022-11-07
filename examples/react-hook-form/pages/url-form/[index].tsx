import { memo, useEffect, useRef } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import { syncEffect } from 'recoil-sync'
import { array, object, string } from '@recoiljs/refine'
import {
  initializableAtomFamily,
  RecoilURLSyncJSONNext,
} from 'recoil-sync-next'
import { useFormSync } from '../../src/hooks/useFormSync'
import styles from '../../styles/form.module.css'

type FormState = {
  name: string
  comment: string
  time: string
  selectedRadio: string
  selectedCheckbox: readonly string[]
  items: readonly {
    radio: string
    checkbox: string
    text: string
  }[]
}

const formState = initializableAtomFamily<FormState, string>({
  key: 'urlFormState',
  effects: [
    syncEffect({
      storeKey: 'url-store',
      refine: object({
        name: string(),
        comment: string(),
        time: string(),
        selectedRadio: string(),
        selectedCheckbox: array(string()),
        items: array(
          object({
            radio: string(),
            checkbox: string(),
            text: string(),
          })
        ),
      }),
    }),
  ],
})

type PageProps = {
  index: string
  defaultValues: FormState
}

let count = 1
const createNewItem = (): FormState['items'][number] => ({
  radio: `${count}`,
  checkbox: `${count++}`,
  text: '',
})

const URLForm: NextPage<PageProps> = ({ index, defaultValues }) => {
  // check render
  const renderRef = useRef(true)
  if (renderRef.current) {
    renderRef.current = false
    console.log(`URLForm[${index}]: initial render`)
  } else {
    console.log(`URLForm[${index}]: re render`)
  }

  const {
    control,
    registerWithDefaultValue,
    registerWithDefaultChecked,
    onChangeForm,
    handleSubmit,
    reset,
    resetFormOnly,
    useFieldArraySync,
  } = useFormSync<FormState>(formState(index, defaultValues))
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArraySync({
      control,
      name: 'items',
    })

  /*
   * Next.js dynamic routes does not unmount page components
   * when only slugs are changed (just re-rendering).
   * Therefore, uncontrolled input elements are not updated
   * from the previous page (i.e. slug).
   * To solve this problem, when slugs ('index' in this case) change,
   * reset the RHF form state to reflect the Recoil state.
   * Unlike reset(), resetFormOnly() doesn't reset the Recoil state.
   */
  useEffect(() => {
    resetFormOnly()
  }, [index, resetFormOnly])

  const onSubmit: SubmitHandler<FormState> = async (data) => {
    console.log('submit data', data)
    await Router.push('/url-form/success')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>URLForm[{index}]</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>URLForm[{index}]</h1>

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
            <dt>time</dt>
            <dd>
              <input type="text" {...registerWithDefaultValue('time')} />
            </dd>
            <dt>items</dt>
            <dd>
              <button type="button" onClick={() => prepend(createNewItem())}>
                Prepend
              </button>
              <ul>
                {fields.map((field, index) => (
                  <li key={field.id}>
                    <span>{index} </span>
                    <input
                      type="radio"
                      {...registerWithDefaultChecked(
                        'selectedRadio',
                        field.radio
                      )}
                    />
                    <input
                      type="checkbox"
                      {...registerWithDefaultChecked(
                        'selectedCheckbox',
                        field.checkbox
                      )}
                    />
                    <input
                      {...registerWithDefaultValue(
                        `items.${index}.text` as const
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => insert(index, createNewItem())}
                    >
                      Insert before
                    </button>
                    <button
                      type="button"
                      onClick={() => insert(index + 1, createNewItem())}
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
              <button type="button" onClick={() => append(createNewItem())}>
                Append
              </button>
            </dd>
          </dl>
          <div>
            <button>Submit</button>
          </div>
          <div>
            <button type="button" onClick={() => reset()}>
              Reset (to Default Values)
            </button>
            <button
              type="button"
              onClick={() =>
                reset({
                  name: '',
                  comment: '',
                  time: '',
                  selectedRadio: '',
                  selectedCheckbox: [],
                  items: [],
                })
              }
            >
              Reset (to Empty Values)
            </button>
          </div>
        </form>
        <div>
          <div>
            <Link href="/url-form/1">Form[1]</Link>
          </div>
          <div>
            <Link href="/url-form/2">Form[2]</Link>
          </div>
          <div>
            <Link href="/url-form/3">Form[3]</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default memo(URLForm)

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
}) => {
  console.log(`URLForm[${params?.index}]: executing gSSP`)
  return {
    props: {
      index: params?.index as string,
      defaultValues: {
        name: 'a',
        comment: 'b',
        time: new Date().toLocaleTimeString(),
        selectedRadio: 'A',
        selectedCheckbox: ['A'],
        items: [
          {
            radio: 'A',
            checkbox: 'A',
            text: '',
          },
          {
            radio: 'B',
            checkbox: 'B',
            text: '',
          },
        ],
      },
    },
  }
}
