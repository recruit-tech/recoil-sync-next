import '@testing-library/jest-dom'
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { act } from 'react-dom/test-utils'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'

import { atomWithInitialValue } from './atomWithInitialValue'

let atomIndex = 0
const nextKey = () => `atomWithInitialValue/test/${atomIndex++}`

const testStringState = atomWithInitialValue<string>({
  key: nextKey(),
})

const testNumberState = atomWithInitialValue<number>({
  key: nextKey(),
})

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>{children}</RecoilRoot>
)

describe('atomWithInitialValue', () => {
  describe('just hook', () => {
    describe('single state', () => {
      it('should be initialized with a specific value', async () => {
        const { result } = renderHook(
          () => useRecoilValue(testStringState('Foo')),
          {
            wrapper: App,
          }
        )

        expect(result.current).toBe('Foo')
      })

      it('should be updated', async () => {
        const { result } = renderHook(
          () => useRecoilState(testStringState('')),
          {
            wrapper: App,
          }
        )
        const [value, setValue] = result.current
        expect(value).toBe('')

        act(() => setValue('Foo'))

        expect(result.current[0]).toBe('Foo')
      })
    })
  })

  describe('with React component', () => {
    const Child = () => {
      const [val, setVal] = useRecoilState(testNumberState(10))

      return (
        <div>
          <button data-testid="button" onClick={() => setVal((v) => v + 1)}>
            {val}
          </button>
        </div>
      )
    }

    it('should be initialized and updated', async () => {
      const { getByTestId } = render(
        <App>
          <Child />
        </App>
      )

      expect(getByTestId('button').textContent).toBe('10')

      fireEvent.click(getByTestId('button'))
      await waitFor(() => expect(getByTestId('button').textContent).toBe('11'))
    })
  })
})
