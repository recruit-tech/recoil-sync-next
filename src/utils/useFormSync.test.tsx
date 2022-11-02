import '@testing-library/jest-dom'
import { array, object, string } from '@recoiljs/refine'
import { render, RenderResult, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockRouter, { useRouter } from 'next-router-mock'
import React, { ReactNode } from 'react'
import { act } from 'react-dom/test-utils'
import { SubmitHandler } from 'react-hook-form'
import { RecoilRoot } from 'recoil'
import { syncEffect } from 'recoil-sync'

import { RecoilHistorySyncJSONNext } from '../history/RecoilHistorySyncJSONNext'

import { initializableAtom } from './initializableAtom'
import { useFormSync } from './useFormSync'

jest.mock('next/router', () => require('next-router-mock'))
// polyfill
global.structuredClone ??= (val: any) => {
  return JSON.parse(JSON.stringify(val))
}

type FormState = {
  name: string
  time: string
  selectedRadio: string
  selectedCheckbox: readonly string[]
  items: readonly {
    value: string
    radio: string
    checkbox: string
  }[]
}

const formState = initializableAtom<FormState>({
  key: 'formState',
  effects: [
    syncEffect({
      refine: object({
        name: string(),
        time: string(),
        selectedRadio: string(),
        selectedCheckbox: array(string()),
        items: array(
          object({
            value: string(),
            radio: string(),
            checkbox: string(),
          })
        ),
      }),
    }),
  ],
})

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>
    <RecoilHistorySyncJSONNext>{children}</RecoilHistorySyncJSONNext>
  </RecoilRoot>
)

describe('useFormSync', () => {
  let submitData

  beforeEach(() => {
    history.replaceState({ key: 'test1' }, '')
    mockRouter.setCurrentUrl('/')
  })

  describe('with React component', () => {
    let count = 1
    const createNewItem = (): FormState['items'][number] => ({
      value: '',
      radio: `${count}`,
      checkbox: `${count++}`,
    })

    const FormExample = () => {
      const {
        control,
        registerWithDefaultValue,
        registerWithDefaultChecked,
        onChangeForm,
        handleSubmit,
        reset,
        useFieldArraySync,
      } = useFormSync(
        formState({
          name: 'initial name',
          time: 'initial time',
          selectedRadio: 'A',
          selectedCheckbox: ['A'],
          items: [
            { value: 'initial items A', radio: 'A', checkbox: 'A' },
            { value: 'initial items B', radio: 'B', checkbox: 'B' },
          ],
        })
      )
      const { fields, append, prepend, remove, swap, move, insert } =
        useFieldArraySync({
          control,
          name: 'items',
        })
      const router = useRouter()
      const onSubmit: SubmitHandler<FormState> = async (data) => {
        submitData = data
        await router.push('/form/success')
      }

      return (
        <form onSubmit={handleSubmit(onSubmit)} onChange={onChangeForm}>
          <dl>
            <dt>name</dt>
            <dd>
              <input
                type="text"
                {...registerWithDefaultValue('name')}
                data-testid="name"
              />
            </dd>
            <dt>time</dt>
            <dd>
              <input
                type="text"
                {...registerWithDefaultValue('time')}
                data-testid="time"
              />
            </dd>
            <dt>items</dt>
            <dd>
              <button type="button" onClick={() => prepend(createNewItem())}>
                Prepend
              </button>
              <ul>
                {fields.map((field, index) => (
                  <li key={field.id} aria-label="items">
                    <span>{index} </span>
                    <input
                      type="radio"
                      {...registerWithDefaultChecked(
                        'selectedRadio',
                        field.radio
                      )}
                      data-testid={`selectedRadio-${index}`}
                    />
                    <input
                      type="checkbox"
                      {...registerWithDefaultChecked(
                        'selectedCheckbox',
                        field.checkbox
                      )}
                      data-testid={`selectedCheckbox-${index}`}
                    />
                    <input
                      {...registerWithDefaultValue(
                        `items.${index}.value` as const
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
          <button>Submit</button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </form>
      )
    }
    const user = userEvent.setup()

    describe('Initial Render', () => {
      let rendered: RenderResult

      beforeEach(() => {
        rendered = render(
          <App>
            <FormExample />
          </App>
        )
      })

      it('should be rendered with default value', async () => {
        expect(rendered.getByTestId('name')).toHaveValue('initial name')
        expect(rendered.getByTestId('time')).toHaveValue('initial time')
        expect(rendered.getByTestId('selectedRadio-0')).toBeChecked()
        expect(rendered.getByTestId('selectedCheckbox-0')).toBeChecked()
        expect(rendered.getByTestId('selectedCheckbox-1')).not.toBeChecked()
      })

      it('should be rendered with 2 items', async () => {
        expect(
          await rendered.findAllByRole('listitem', { name: 'items' })
        ).toHaveLength(2)
      })

      describe('then, update name state', () => {
        beforeEach(async () => {
          await user.clear(rendered.getByTestId('name'))
          await user.type(rendered.getByTestId('name'), 'test name')
        })

        it('should be rendered with updated value', () => {
          expect(rendered.getByTestId('name')).toHaveValue('test name')
        })

        describe('then, navigate to the same URL (replacestate)', () => {
          beforeEach(() => {
            act(() => {
              mockRouter.replace('/')
            })
          })

          it('should be rendered with same values', async () => {
            expect(rendered.getByTestId('name')).toHaveValue('test name')
          })

          // todo(akfm): [Bug?]The URL does not change when the URL changes.
          describe.skip('then, navigate to the new URL (pushstate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.push('/next')
                global.history.state.key = 'test2'
              })
            })

            it('should be rendered  default values', () => {
              expect(rendered.getByTestId('name')).toHaveValue('initial name')
            })
          })
        })
      })

      describe('then, update time state', () => {
        const now = new Date().toLocaleTimeString()

        beforeEach(async () => {
          await user.clear(rendered.getByTestId('time'))
          await user.type(rendered.getByTestId('time'), now)
        })

        it('should be rendered with updated value', () => {
          expect(rendered.getByTestId('time')).toHaveValue(now)
        })
      })

      describe('then, update items state', () => {
        describe('Prepend action', () => {
          beforeEach(async () => {
            await user.click(rendered.getByText('Prepend'))
          })

          it('should be rendered with 3 items', async () => {
            const listItems = await rendered.findAllByRole('listitem', {
              name: 'items',
            })
            expect(listItems).toHaveLength(3)
            // The first item changes
            expect(
              await within(listItems[0]).findByRole('checkbox')
            ).not.toBeChecked()
          })
        })

        describe('Append action', () => {
          beforeEach(async () => {
            await user.click(rendered.getByText('Append'))
          })

          it('should be rendered with 3 items', async () => {
            const listItems = await rendered.findAllByRole('listitem', {
              name: 'items',
            })
            expect(listItems).toHaveLength(3)
            // The first item never changes
            expect(
              await within(listItems[0]).findByRole('checkbox')
            ).toBeChecked()
          })
        })
      })
    })
  })
})
